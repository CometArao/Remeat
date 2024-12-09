"use strict";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm"; // Importar In desde typeorm
import Pedido from "../entity/pedido.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Proveedor from "../entity/proveedor.entity.js"; // Importa la entidad Proveedor
import Ingrediente from "../entity/ingrediente.entity.js"; // Importa la entidad Ingrediente
import Utensilio from "../entity/utensilio.entity.js"; // Importa la entidad Utensilio

export async function createPedidoService(data) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    try {
        const {
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido = "Pendiente",
            fecha_entrega_pedido,
            id_usuario,
            id_proveedor,
            ingredientes = [], // Valores predeterminados como arrays vacíos
            utensilios = [] // Valores predeterminados como arrays vacíos
        } = data;

        let costoTotal = 0;

        // Crear el pedido inicial
        const newPedido = pedidoRepository.create({
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido,
            fecha_entrega_pedido,
            costo_pedido: 0, // Inicialmente 0, se actualizará después
            id_usuario,
            id_proveedor,
        });

        // Procesar ingredientes si existen
        if (ingredientes.length > 0) {
            const foundIngredientes = await ingredienteRepository.find({
                where: { id_ingrediente: In(ingredientes.map(i => i.id_ingrediente)) },
                relations: ["tipo_ingrediente"]
            });

            if (foundIngredientes.length !== ingredientes.length) {
                return [null, "Uno o más ingredientes no existen"];
            }

            newPedido.ingredientes = foundIngredientes.map((ing) => {
                const ingredientePedido = ingredientes.find(i => i.id_ingrediente === ing.id_ingrediente);
                const cantidad = ingredientePedido ? ingredientePedido.cantidad : 0;
                const costo = cantidad * ing.costo_ingrediente;
                costoTotal += costo;

                return {
                    ...ing,
                    cantidad_ingrediente: cantidad
                };
            });
        }

        // Procesar utensilios si existen
        if (utensilios.length > 0) {
            const foundUtensilios = await utensilioRepository.find({
                where: { id_utensilio: In(utensilios.map(u => u.id_utensilio)) },
                relations: ["tipo_utensilio"]
            });

            if (foundUtensilios.length !== utensilios.length) {
                return [null, "Uno o más utensilios no existen"];
            }

            newPedido.utensilios = foundUtensilios.map((ut) => {
                const utensilioPedido = utensilios.find(u => u.id_utensilio === ut.id_utensilio);
                const cantidad = utensilioPedido ? utensilioPedido.cantidad : 0;
                const costo = cantidad * ut.costo_utensilio;
                costoTotal += costo;

                return {
                    ...ut,
                    cantidad_utensilio: cantidad
                };
            });
        }

        // Asignar el costo total al pedido
        newPedido.costo_pedido = costoTotal;

        // Guardar el pedido
        const savedPedido = await pedidoRepository.save(newPedido);

        return [savedPedido, null];
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return [null, error.message];
    }
}



export async function validateIngredientesYUtensilios(ingredientes, utensilios) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    if (ingredientes && ingredientes.length > 0) {
        const foundIngredientes = await ingredienteRepository.findByIds(ingredientes);
        if (foundIngredientes.length !== ingredientes.length) {
            return ["Algunos ingredientes no existen."];
        }
    }

    if (utensilios && utensilios.length > 0) {
        const foundUtensilios = await utensilioRepository.findByIds(utensilios);
        if (foundUtensilios.length !== utensilios.length) {
            return ["Algunos utensilios no existen."];
        }
    }

    return [null]; // No hay errores
}

export async function getAllPedidosService() {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    try {
        const pedidos = await pedidoRepository.find({
            relations: [
                "usuario",
                "proveedor",
                "ingredientes",
                "ingredientes.tipo_ingrediente", // Asegurarse de que esta relación esté presente
                "utensilios",
                "utensilios.tipo_utensilio"
            ]
        });

        const responseData = pedidos.map(p => ({
            id_pedido: p.id_pedido,
            descripcion_pedido: p.descripcion_pedido,
            fecha_compra_pedido: p.fecha_compra_pedido,
            estado_pedido: p.estado_pedido,
            fecha_entrega_pedido: p.fecha_entrega_pedido,
            costo_pedido: p.costo_pedido,
            id_usuario: p.usuario.id_usuario,
            id_proveedor: p.proveedor ? p.proveedor.id_proveedor : null,
            ingredientes: p.ingredientes.map(ing => ({
                id_ingrediente: ing.id_ingrediente,
                nombre_tipo_ingrediente: ing.tipo_ingrediente
                    ? ing.tipo_ingrediente.nombre_tipo_ingrediente
                    : "Sin tipo",
                cantidad_ingrediente: ing.cantidad_ingrediente,
                costo_ingrediente: ing.costo_ingrediente
            })),
            utensilios: p.utensilios.map(ut => ({
                id_utensilio: ut.id_utensilio,
                nombre_tipo_utensilio: ut.tipo_utensilio.nombre_tipo_utensilio,
                cantidad_utensilio: ut.cantidad_utensilio,
                costo_utensilio: ut.costo_utensilio
            }))
        }));

        return [responseData, null];
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        return [null, error.message];
    }
}



// Obtener un pedido específico por ID
export async function getPedidoByIdService(id_pedido) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    try {
       const pedido = await pedidoRepository.findOne({
           where:{ id_pedido },
           relations:["usuario","proveedor"], // Si deseas incluir información del usuario y proveedor
       });

       if (!pedido) {
           return [null,"Pedido no encontrado"];
       }

       return [pedido,null];
   } catch (error) {
       console.error("Error al obtener el pedido:", error);
       return [null,error.message];
   }
}

export async function updatePedidoService(id_pedido,data) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    try {
       // Verificar si el pedido existe
       const pedido = await pedidoRepository.findOne({
           where:{ id_pedido },
           relations:["usuario"] // Asegúrate de incluir la relación con el usuario
       });
       
       if (!pedido) {
           return [null,"Pedido no encontrado"];
       }

       // Solo permitir actualizar ciertos campos
       const { descripcion_pedido, estado_pedido, costo_pedido, id_proveedor } = data;

       // Actualizar solo los campos permitidos
       if (descripcion_pedido !== undefined) { 
           pedido.descripcion_pedido= descripcion_pedido;
       }
       
       if (estado_pedido !== undefined) { 
           pedido.estado_pedido= estado_pedido;
       }
       
       if (costo_pedido !== undefined) { 
           pedido.costo_pedido= costo_pedido;
       }

      if (id_proveedor !== undefined) { 
          const proveedorRepository = AppDataSource.getRepository(Proveedor); 
          const proveedor = await proveedorRepository.findOneBy({ id_proveedor }); 
          if (!proveedor){ 
              return [null,"Proveedor no encontrado"]; 
          } 
          pedido.proveedor=proveedor; 
      }

      // Guardar los cambios en el pedido
      await pedidoRepository.save(pedido);

      return [pedido,null];
   } catch (error) { 
      console.error("Error al actualizar el pedido:", error); 
      return [null,error.message]; 
   }
}

export async function deletePedidoService(id_pedido ) { 
   const pedidoRepository=AppDataSource.getRepository(Pedido);

   try { 
      // Verificar si el pedido existe 
      const pedidos=await pedidoRepository.findOneBy({ id_pedido }); 
      if(!pedidos){ 
          return [null," Pedido no encontrado"]; 
      }

      await pedidoRepository.delete(id_pedido ); 

      return [true,null]; // Retornar true si se eliminó exitosamente 
   } catch(error){ 
      console.error(" Error al eliminar el Pedido:", error); 
      return[ null,error.message]; 
   } 
}