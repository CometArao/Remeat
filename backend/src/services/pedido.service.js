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

        // Crear el pedido básico
        const newPedido = pedidoRepository.create({
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido,
            fecha_entrega_pedido,
            costo_pedido: 0,
            id_usuario,
            id_proveedor,
        });

        // Guardar el pedido
        const savedPedido = await pedidoRepository.save(newPedido);

    // Procesar ingredientes
    if (ingredientes.length > 0) {
        const foundIngredientes = await ingredienteRepository.find({
            where: { id_ingrediente: In(ingredientes.map((i) => i.id_ingrediente)) },
        });

        if (foundIngredientes.length !== ingredientes.length) {
            return [null, "Uno o más ingredientes no existen"];
        }

    for (const ing of ingredientes) {
        const dbIngrediente = foundIngredientes.find((dbIng) => dbIng.id_ingrediente === ing.id_ingrediente);

        if (!dbIngrediente) {
            throw new Error(`Ingrediente con id ${ing.id_ingrediente} no encontrado`);
        }

        // Buscar el tipo de ingrediente en la tabla tipo_ingrediente
        const dbTipoIngrediente = await tipoIngredienteRepository.findOneBy({
            id_tipo_ingrediente: dbIngrediente.id_tipo_ingrediente,
        });

        console.log(dbTipoIngrediente);

        // Si no se encuentra el tipo de ingrediente, asignar valores predeterminados
        const nombreTipoIngrediente = dbTipoIngrediente?.nombre_tipo_ingrediente || "Sin tipo";
        console.log(nombreTipoIngrediente)

        // Calcular el costo basado en la cantidad
        const costo = ing.cantidad_ingrediente * dbIngrediente.costo_ingrediente;
        costoTotal += costo;

        // Guardar la relación compuesta
        await compuestoIngredienteRepository.save({
            id_pedido: savedPedido.id_pedido,
            id_ingrediente: dbIngrediente.id_ingrediente,
            cantidad_pedida: ing.cantidad_ingrediente,
        });

        // Asignar los datos relacionados
        ing.nombre_tipo_ingrediente = nombreTipoIngrediente;
        ing.costo_ingrediente = dbIngrediente.costo_ingrediente;
        console.log("Agregado" + ing.nombre_tipo_ingrediente)
    }
}

        // Procesar utensilios
        if (utensilios.length > 0) {
            const foundUtensilios = await utensilioRepository.find({
                where: { id_utensilio: In(utensilios.map((u) => u.id_utensilio)) },
                relations: ["tipo_utensilio"], // Asegurarse de incluir la relación tipo_utensilio
            });

            if (foundUtensilios.length !== utensilios.length) {
                return [null, "Uno o más utensilios no existen"];
            }

            for (const ut of utensilios) {
                const dbUtensilio = foundUtensilios.find((dbUt) => dbUt.id_utensilio === ut.id_utensilio);

                if (!dbUtensilio) {
                    throw new Error(`Utensilio con id ${ut.id_utensilio} no encontrado`);
                }

                const costo = ut.cantidad_utensilio * dbUtensilio.costo_utensilio;
                costoTotal += costo;

                await compuestoUtensilioRepository.save({
                    id_pedido: savedPedido.id_pedido,
                    id_utensilio: dbUtensilio.id_utensilio,
                    cantidad_pedida: ut.cantidad_utensilio,
                });

                // Añadir los datos que faltaban en el correo
                ut.nombre_tipo_utensilio = dbUtensilio.tipo_utensilio?.nombre_tipo_utensilio || "Sin tipo";
                ut.costo_utensilio = dbUtensilio.costo_utensilio;
            }
        }

        // Actualizar el costo total del pedido
        savedPedido.costo_pedido = costoTotal;
        await pedidoRepository.save(savedPedido);
            
        // Devuelve el pedido, ingredientes y utensilios procesados
        return [savedPedido, ingredientes, utensilios, null];
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

export async function changePedidoToIngresadoService(pedidoId) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    try {
        // Obtener el pedido
        const pedido = await pedidoRepository.findOne({
            where: { id_pedido: pedidoId },
            relations: ["ingredientes", "utensilios"],
        });

        if (!pedido) {
            return [null, `El pedido con ID ${pedidoId} no existe.`];
        }

        // Crear ingredientes y utensilios en el sistema
        const currentDate = new Date();
        const createdEntities = [];

        if (pedido.ingredientes.length > 0) {
            for (const ing of pedido.ingredientes) {
                const newIngrediente = ingredienteRepository.create({
                    fecha_vencimiento: currentDate, // Puedes modificar esto según tus necesidades
                    cantidad_ingrediente: ing.cantidad_ingrediente,
                    cantidad_original_ingrediente: ing.cantidad_ingrediente,
                    costo_ingrediente: ing.costo_ingrediente,
                    tipo_ingrediente: ing.tipo_ingrediente,
                });
                const savedIngrediente = await ingredienteRepository.save(newIngrediente);
                createdEntities.push(savedIngrediente);
            }
        }

        if (pedido.utensilios.length > 0) {
            for (const ut of pedido.utensilios) {
                const newUtensilio = utensilioRepository.create({
                    cantidad_utensilio: ut.cantidad_utensilio,
                    costo_utensilio: ut.costo_utensilio,
                    tipo_utensilio: ut.tipo_utensilio,
                });
                const savedUtensilio = await utensilioRepository.save(newUtensilio);
                createdEntities.push(savedUtensilio);
            }
        }

        // Cambiar el estado del pedido a "Ingresado"
        pedido.estado_pedido = "Ingresado";
        await pedidoRepository.save(pedido);

        return [createdEntities, null];
    } catch (error) {
        console.error("Error cambiando estado del pedido:", error);
        return [null, error.message];
    }
}
