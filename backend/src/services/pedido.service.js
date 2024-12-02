"use strict";
import { AppDataSource } from "../config/configDb.js";
import Pedido from "../entity/pedido.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Proveedor from "../entity/proveedor.entity.js"; // Importa la entidad Proveedor
import Ingrediente from "../entity/ingrediente.entity.js"; // Importa la entidad Ingrediente
import Utensilio from "../entity/utensilio.entity.js"; // Importa la entidad Utensilio

export async function createPedidoService(data) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const proveedorRepository = AppDataSource.getRepository(Proveedor); 
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente); // Importa Ingrediente
    const utensilioRepository = AppDataSource.getRepository(Utensilio); // Importa Utensilio

    try {
        const { 
            descripcion_pedido,
            fecha_compra_pedido,
            estado_pedido,
            fecha_entrega_pedido,
            costo_pedido,
            id_usuario,
            id_proveedor,
            ingredientes, // Asegúrate de incluir este campo
            utensilios // Asegúrate de incluir este campo
         } = data;

         // Verificar que el usuario exista y sea administrador
         const usuario = await usuarioRepository.findOneBy({ id_usuario });
         if (!usuario || usuario.rol_usuario !== "administrador") {
             return [null,"El usuario no existe o no tiene permisos para crear pedidos"];
         }

         // Verificar que el proveedor exista
         const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
         if (!proveedor) {
             return [null,"El proveedor no existe"];
         }

         // Crear el pedido
         const newPedido = pedidoRepository.create({
             descripcion_pedido,
             fecha_compra_pedido,
             estado_pedido,
             fecha_entrega_pedido,
             costo_pedido,
             usuario,
             proveedor // Asignar el proveedor al nuevo pedido
         });

         // Si hay ingredientes o utensilios, asignarlos al pedido
         if (ingredientes && ingredientes.length > 0) {
             newPedido.ingredientes = await ingredienteRepository.findByIds(ingredientes);
         }

         if (utensilios && utensilios.length > 0) {
             newPedido.utensilios = await utensilioRepository.findByIds(utensilios);
         }
        
         await pedidoRepository.save(newPedido);

         return [newPedido,null];
     } catch (error) {
         console.error("Error al crear el pedido:", error);
         return [null,error.message];
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
           relations: ["usuario", "proveedor"], // Incluye información del usuario y proveedor si es necesario
       });

       // Preparar la respuesta sin información sensible del usuario
       const responseData = pedidos.map(p => ({
           id_pedido: p.id_pedido,
           descripcion_pedido: p.descripcion_pedido,
           fecha_compra_pedido: p.fecha_compra_pedido,
           estado_pedido: p.estado_pedido,
           fecha_entrega_pedido: p.fecha_entrega_pedido,
           costo_pedido: p.costo_pedido,
           id_usuario: p.usuario.id_usuario, // Solo incluye el ID del usuario
           id_proveedor: p.proveedor ? p.proveedor.id_proveedor : null // Incluir ID del proveedor si existe
       }));

       return [responseData,null];
   } catch (error) {
       console.error("Error al obtener los pedidos:", error);
       return [null,error.message];
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