"use strict";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm"; // Importar In desde typeorm
import Pedido from "../entity/pedido.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Proveedor from "../entity/proveedor.entity.js"; // Importa la entidad Proveedor
import Ingrediente from "../entity/ingrediente.entity.js"; // Importa la entidad Ingrediente
import Utensilio from "../entity/utensilio.entity.js"; // Importa la entidad Utensilio
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";

export async function createPedidoService(data) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    const compuestoIngredienteRepository = AppDataSource.getRepository("compuesto_ingrediente");
    const compuestoUtensilioRepository = AppDataSource.getRepository("compuesto_utensilio");
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const {
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido = "Pendiente",
            fecha_entrega_pedido,
            id_usuario,
            id_proveedor,
            ingredientes = [],
            utensilios = [],
        } = data;

        let costoTotal = 0;

        // Crear el pedido básico con las fechas en formato timestamp
        const newPedido = pedidoRepository.create({
            descripcion_pedido,
            fecha_compra_pedido, // Hora actual ya calculada en el controlador
            estado_pedido,
            fecha_entrega_pedido, // Validada en el controlador
            costo_pedido: 0,
            id_usuario,
            id_proveedor,
        });

        // Guardar el pedido
        const savedPedido = await pedidoRepository.save(newPedido);

        // Procesar ingredientes y utensilios
        if (ingredientes.length > 0) {
            const foundIngredientes = await ingredienteRepository.find({
                where: { id_ingrediente: In(ingredientes.map((i) => i.id_ingrediente)) },
            });

            if (foundIngredientes.length !== ingredientes.length) {
                return [null, "Uno o más ingredientes no existen"];
            }

            for (const ing of ingredientes) {
                const dbIngrediente = foundIngredientes.find(
                    (dbIng) => dbIng.id_ingrediente === ing.id_ingrediente
                );

                if (!dbIngrediente) {
                    throw new Error(`Ingrediente con id ${ing.id_ingrediente} no encontrado`);
                }

                const dbTipoIngrediente = await tipoIngredienteRepository.findOneBy({
                    id_tipo_ingrediente: dbIngrediente.id_tipo_ingrediente,
                });

                const nombreTipoIngrediente = dbTipoIngrediente?.nombre_tipo_ingrediente || "Sin tipo";

                const costo = ing.cantidad_ingrediente * dbIngrediente.costo_ingrediente;
                costoTotal += costo;

                await compuestoIngredienteRepository.save({
                    id_pedido: savedPedido.id_pedido,
                    id_ingrediente: dbIngrediente.id_ingrediente,
                    cantidad_pedida: ing.cantidad_ingrediente,
                    id_tipo_ingrediente: dbIngrediente.id_tipo_ingrediente,
                });

                ing.id_tipo_ingrediente = dbIngrediente.id_tipo_ingrediente;
                ing.nombre_tipo_ingrediente = nombreTipoIngrediente;
                ing.costo_ingrediente = dbIngrediente.costo_ingrediente;
            }
        }
        
        if (utensilios.length > 0) {
            const foundUtensilios = await utensilioRepository.find({
                where: { id_utensilio: In(utensilios.map((u) => u.id_utensilio)) },
                relations: ["tipo_utensilio"], // Relación con tipo_utensilio
            });
        
            if (foundUtensilios.length !== utensilios.length) {
                return [null, "Uno o más utensilios no existen"];
            }
        
            for (const ut of utensilios) {
                const dbUtensilio = foundUtensilios.find(
                    (dbUt) => dbUt.id_utensilio === ut.id_utensilio
                );
        
                if (!dbUtensilio) {
                    throw new Error(`Utensilio con id ${ut.id_utensilio} no encontrado`);
                }
        
                const costo = ut.cantidad_utensilio * dbUtensilio.costo_utensilio;
                costoTotal += costo;
        
                // Guardar la relación en compuesto_utensilio
                await compuestoUtensilioRepository.save({
                    id_pedido: savedPedido.id_pedido,
                    id_utensilio: dbUtensilio.id_utensilio,
                    cantidad_pedida: ut.cantidad_utensilio,
                });
        
                // Añadir información adicional para la respuesta
                ut.nombre_tipo_utensilio = dbUtensilio.tipo_utensilio?.nombre_tipo_utensilio || "Sin tipo";
                ut.costo_utensilio = dbUtensilio.costo_utensilio;
            }
        }

        savedPedido.costo_pedido = costoTotal;
        await pedidoRepository.save(savedPedido);

        return [savedPedido, ingredientes, utensilios, null];
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        return [null, error.message];
    }
}

export async function validateIngredientesYUtensilios(ingredientes, utensilios) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    try {
        // Validar ingredientes
        if (ingredientes.length > 0) {
            const foundIngredientes = await ingredienteRepository.find({
                where: { id_ingrediente: In(ingredientes.map((i) => i.id_ingrediente)) },
            });
            if (foundIngredientes.length !== ingredientes.length) {
                return ["Uno o más ingredientes no existen"];
            }
        }

        // Validar utensilios
        if (utensilios.length > 0) {
            const foundUtensilios = await utensilioRepository.find({
                where: { id_utensilio: In(utensilios.map((u) => u.id_utensilio)) },
            });
            if (foundUtensilios.length !== utensilios.length) {
                return ["Uno o más utensilios no existen"];
            }
        }

        return [null];
    } catch (error) {
        console.error("Error en la validación de ingredientes y utensilios:", error);
        return [error.message];
    }
}

export async function getAllPedidosService() {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const compuestoIngredienteRepository = AppDataSource.getRepository("compuesto_ingrediente");
    const compuestoUtensilioRepository = AppDataSource.getRepository("compuesto_utensilio");

    try {
        // Obtener pedidos con relaciones básicas
        const pedidos = await pedidoRepository.find({
            relations: ["usuario", "proveedor"] // Solo incluir las relaciones directas
        });

        // Procesar cada pedido para incluir ingredientes y utensilios desde las tablas intermedias
        const responseData = await Promise.all(
            pedidos.map(async (p) => {
                // Obtener ingredientes asociados al pedido desde compuesto_ingrediente
                const compuestosIngredientes = await compuestoIngredienteRepository.find({
                    where: { id_pedido: p.id_pedido },
                    relations: ["ingrediente", "ingrediente.tipo_ingrediente"]
                });

                // Formatear los ingredientes
                const ingredientes = compuestosIngredientes.map((ci) => ({
                    id_ingrediente: ci.ingrediente.id_ingrediente,
                    nombre_tipo_ingrediente: ci.ingrediente.tipo_ingrediente
                        ? ci.ingrediente.tipo_ingrediente.nombre_tipo_ingrediente
                        : "Sin tipo",
                    cantidad_ingrediente: ci.cantidad_pedida, // Usar la cantidad pedida
                    costo_ingrediente: ci.ingrediente.costo_ingrediente
                }));

                // Obtener utensilios asociados al pedido desde compuesto_utensilio
                const compuestosUtensilios = await compuestoUtensilioRepository.find({
                    where: { id_pedido: p.id_pedido },
                    relations: ["utensilio", "utensilio.tipo_utensilio"]
                });

                // Formatear los utensilios
                const utensilios = compuestosUtensilios.map((cu) => ({
                    id_utensilio: cu.utensilio.id_utensilio,
                    nombre_tipo_utensilio: cu.utensilio.tipo_utensilio.nombre_tipo_utensilio,
                    cantidad_utensilio: cu.cantidad_pedida, // Usar la cantidad pedida
                    costo_utensilio: cu.utensilio.costo_utensilio
                }));

                return {
                    id_pedido: p.id_pedido,
                    descripcion_pedido: p.descripcion_pedido,
                    fecha_compra_pedido: p.fecha_compra_pedido,
                    estado_pedido: p.estado_pedido,
                    fecha_entrega_pedido: p.fecha_entrega_pedido,
                    costo_pedido: p.costo_pedido,
                    id_usuario: p.usuario.id_usuario,
                    id_proveedor: p.proveedor ? p.proveedor.id_proveedor : null,
                    ingredientes,
                    utensilios
                };
            })
        );

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


// Servicio para actualizar el estado del pedido
export async function updateEstadoPedidoService(id_pedido, nuevoEstado) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);

    try {
        // Verificar si el pedido existe
        const pedido = await pedidoRepository.findOne({
            where: { id_pedido },
        });

        if (!pedido) {
            return [null, "Pedido no encontrado"];
        }

        // Actualizar el estado del pedido
        pedido.estado_pedido = nuevoEstado;
        await pedidoRepository.save(pedido);

        return [pedido, null]; // Devolver el pedido actualizado
    } catch (error) {
        console.error("Error actualizando el estado del pedido:", error);
        return [null, error.message];
    }
}
