"use strict";
import { createPedidoService, 
    deletePedidoService, 
    getAllPedidosService, 
    getPedidoByIdService, 
    updatePedidoService,
    validateIngredientesYUtensilios } from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pedidoValidation } from "../validations/pedido.validation.js"; // Importa las validaciones
import { sendEmail } from "../config/mailer.js"; // Importa la función para enviar correos

export async function createPedido(req, res) {
    try {
        const { error } = pedidoValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { ingredientes, utensilios } = req.body;

        // Verificar que los ingredientes y utensilios existan
        const [validationError] = await validateIngredientesYUtensilios(ingredientes, utensilios);
        if (validationError) {
            return handleErrorClient(res, 400, validationError);
        }

        const [newPedido, serviceError] = await createPedidoService(req.body);
        if (serviceError) {
            return handleErrorClient(res, 400, serviceError);
        }

        // Obtener el correo del proveedor
        const proveedorEmail = newPedido.proveedor ? newPedido.proveedor.correo_proveedor : null;

        // Enviar correo al proveedor
        if (proveedorEmail) {
            await sendEmail(
                proveedorEmail,
                "Nuevo Pedido Creado",
                {
                    id_pedido: newPedido.id_pedido,
                    descripcion_pedido: newPedido.descripcion_pedido,
                    fecha_compra_pedido: newPedido.fecha_compra_pedido,
                    fecha_entrega_pedido: newPedido.fecha_entrega_pedido,
                    nombre_usuario: newPedido.usuario.nombre_usuario,
                    costo_pedido: newPedido.costo_pedido,
                    ingredientes: newPedido.ingredientes || [], // Asegúrate de incluir los ingredientes
                    utensilios: newPedido.utensilios || []      // Asegúrate de incluir los utensilios
                }
            );
        }

        // Preparar la respuesta sin información sensible del usuario
        const responseData = {
            id_pedido: newPedido.id_pedido,
            descripcion_pedido: newPedido.descripcion_pedido,
            fecha_compra_pedido: newPedido.fecha_compra_pedido,
            estado_pedido: newPedido.estado_pedido,
            fecha_entrega_pedido: newPedido.fecha_entrega_pedido,
            costo_pedido: newPedido.costo_pedido,
            id_usuario: newPedido.usuario.id_usuario,
            id_proveedor: newPedido.proveedor ? newPedido.proveedor.id_proveedor : null
        };

        handleSuccess(res, 201, "Pedido creado exitosamente", responseData);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Obtener todos los pedidos
export async function getAllPedidos(req, res) {
    try {
        const [pedidos, error] = await getAllPedidosService();
        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Pedidos obtenidos exitosamente", pedidos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Obtener un pedido específico por ID
export async function getPedidoById(req, res) {
    const { id_pedido } = req.params; // Asumiendo que el ID se pasa como parámetro en la URL

    try {
        const [pedido, error] = await getPedidoByIdService(id_pedido);
        if (error) {
            if (error === "Pedido no encontrado") {
                return handleErrorClient(res, 404, error);
            }
            return handleErrorServer(res, 500, error);
        }

        // Preparar la respuesta sin información sensible del usuario
        const responseData = {
            id_pedido: pedido.id_pedido,
            descripcion_pedido: pedido.descripcion_pedido,
            fecha_compra_pedido: pedido.fecha_compra_pedido,
            estado_pedido: pedido.estado_pedido,
            fecha_entrega_pedido: pedido.fecha_entrega_pedido,
            costo_pedido: pedido.costo_pedido,
            id_usuario: pedido.usuario.id_usuario,
            id_proveedor: pedido.proveedor ? pedido.proveedor.id_proveedor : null // Incluir ID del proveedor
        };

        handleSuccess(res, 200, "Pedido obtenido exitosamente", responseData);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updatePedido(req, res) {
    const { id_pedido } = req.params; // Asumiendo que el ID se pasa como parámetro en la URL

    try {
        const [updatedPedido, error] = await updatePedidoService(id_pedido, req.body);
        if (error) {
            if (error === "Pedido no encontrado") {
                return handleErrorClient(res, 404, error);
            }
            return handleErrorServer(res, 500, error);
        }

        // Preparar la respuesta sin información sensible del usuario
        const responseData = {
            id_pedido: updatedPedido.id_pedido,
            descripcion_pedido: updatedPedido.descripcion_pedido,
            fecha_compra_pedido: updatedPedido.fecha_compra_pedido,
            estado_pedido: updatedPedido.estado_pedido,
            fecha_entrega_pedido: updatedPedido.fecha_entrega_pedido,
            costo_pedido: updatedPedido.costo_pedido,
            id_usuario: updatedPedido.usuario ? updatedPedido.usuario.id_usuario : null,
            id_proveedor: updatedPedido.proveedor ? updatedPedido.proveedor.id_proveedor : null 
            // Incluir ID del proveedor
        };

        handleSuccess(res, 200,"Pedido actualizado exitosamente", responseData);
    } catch (error) {
       handleErrorServer(res ,500 ,error.message );
   }
}

export async function deletePedido(req, res) {
    const { id_pedido } = req.params; // Asumiendo que el ID se pasa como parámetro en la URL

    try {
        const [result, error] = await deletePedidoService(id_pedido);
        if (error) {
            if (error === "Pedido no encontrado") {
                return handleErrorClient(res ,404 ,error);
            }
            return handleErrorServer(res ,500 ,error);
        }

        handleSuccess(res ,200 ,"Pedido eliminado exitosamente", null);
    } catch (error) {
       handleErrorServer(res ,500 ,error.message );
   }
}