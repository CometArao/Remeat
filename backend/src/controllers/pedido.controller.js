"use strict";
import {
    createPedidoService,
    deletePedidoService,
    getAllPedidosService,
    getPedidoByIdService,
    updatePedidoService,
    validateIngredientesYUtensilios
} from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pedidoValidation } from "../validations/pedido.validation.js";
import { sendEmail } from "../config/mailer.js";
import {
    getProveedorByIdService,
} from "../services/proveedor.service.js"; // Asegúrate de tener este servicio

// Asegúrate de importar AppDataSource, Proveedor y Usuario
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";
import Usuario from "../entity/usuario.entity.js";

export async function createPedido(req, res) {
    try {
        const { error } = pedidoValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { ingredientes = [], utensilios = [] } = req.body; // Valores predeterminados como arrays vacíos

        // Verificar que al menos haya un ingrediente o utensilio
        if (ingredientes.length === 0 && utensilios.length === 0) {
            return handleErrorClient(res, 400, "El pedido debe incluir al menos un ingrediente o un utensilio.");
        }

        // Verificar que los ingredientes y utensilios existan
        const [validationError] = await validateIngredientesYUtensilios(ingredientes, utensilios);
        if (validationError) {
            return handleErrorClient(res, 400, validationError);
        }

        const [newPedido, serviceError] = await createPedidoService(req.body);
        if (serviceError) {
            return handleErrorClient(res, 400, serviceError);
        }

        // Obtener el correo y nombre del proveedor
        const proveedor = await obtenerProveedor(newPedido.id_proveedor);

        // Enviar correo al proveedor
        if (proveedor && proveedor.correo_proveedor) {
            await sendEmail(
                proveedor.correo_proveedor,
                "Nuevo Pedido Creado",
                {
                    id_pedido: newPedido.id_pedido,
                    descripcion_pedido: newPedido.descripcion_pedido,
                    fecha_compra_pedido: newPedido.fecha_compra_pedido,
                    fecha_entrega_pedido: newPedido.fecha_entrega_pedido,
                    nombre_usuario: await obtenerNombreUsuario(newPedido.id_usuario),
                    costo_pedido: newPedido.costo_pedido,
                    ingredientes: ingredientes.length > 0
                        ? newPedido.ingredientes.map(ing => ({
                              id_ingrediente: ing.id_ingrediente,
                              nombre_tipo_ingrediente: ing.tipo_ingrediente?.nombre_tipo_ingrediente || "Sin tipo",
                              cantidad_ingrediente: ing.cantidad_ingrediente,
                              costo_ingrediente: ing.costo_ingrediente
                          }))
                        : [],
                    utensilios: utensilios.length > 0
                        ? newPedido.utensilios.map(ut => ({
                              id_utensilio: ut.id_utensilio,
                              nombre_tipo_utensilio: ut.tipo_utensilio?.nombre_tipo_utensilio || "Sin tipo",
                              cantidad_utensilio: ut.cantidad_utensilio,
                              costo_utensilio: ut.costo_utensilio
                          }))
                        : [],
                    nombre_proveedor: proveedor.nombre_proveedor
                }
            );
        }

        handleSuccess(res, 201, "Pedido creado exitosamente", newPedido);
    } catch (error) {
        console.error("Error en el controlador:", error);
        handleErrorServer(res, 500, error.message);
    }
}


// Función auxiliar para obtener el proveedor completo
async function obtenerProveedor(id_proveedor) {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
    return proveedor;
}

// Función auxiliar para obtener el nombre del usuario (sin cambios)
async function obtenerNombreUsuario(id_usuario) {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ id_usuario });
    return usuario ? usuario.nombre_usuario : "Usuario desconocido";
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