"use strict";
import {
    createPedidoService,
    deletePedidoService,
    getAllPedidosService,
    getPedidoByIdService,
    updateEstadoPedidoService,
    updatePedidoService,
    validateIngredientesYUtensilios
} from "../services/pedido.service.js";

import { createIngredienteService } from "../services/ingrediente.service.js";
import { createUtensilioService } from "../services/utensilio.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pedidoValidation } from "../validations/pedido.validation.js";
import { sendEmail } from "../config/mailer.js";
import { getProveedorByIdService } from "../services/proveedor.service.js"; // Asegúrate de tener este servicio
import {
    compareDateTime,
    getCurrentChileanTimestamp,
    truncateToMinutes,
} from "../utils/dateUtils.js";

// Asegúrate de importar AppDataSource, Proveedor y Usuario
import { AppDataSource } from "../config/configDb.js";
import Proveedor from "../entity/proveedor.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Pedido from "../entity/pedido.entity.js";
import compuestoIngrediente from "../entity/compuesto_ingrediente.js";
import compuestoUtensilio from "../entity/compuesto_utensilio.js";
import tipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import tipoUtensilio from "../entity/tipo_utensilio.entity.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import Utensilio from "../entity/utensilio.entity.js";

export async function createPedido(req, res) {
    try {
        console.log(req.body);
        const { error } = pedidoValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const { ingredientes = [], utensilios = [], fecha_entrega_pedido } = req.body;

        // Verificar que al menos haya un ingrediente o utensilio
        if (ingredientes.length === 0 && utensilios.length === 0) {
            return handleErrorClient(
                res,
                400,
                "El pedido debe incluir al menos un ingrediente o un utensilio."
            );
        }

        // Validar la fecha de entrega con la hora actual
        const validEntrega = compareDateTime(fecha_entrega_pedido, {
            message: (msg) => msg, // Función mock para obtener mensajes de error
        });
        if (validEntrega) {
            // Si se devuelve un mensaje, significa que hubo un error
            console.log(validEntrega);
            return handleErrorClient(res, 401, validEntrega);
        }

        // Asignar fecha de compra como la hora actual truncada
        req.body.fecha_compra_pedido = truncateToMinutes(getCurrentChileanTimestamp()).toISOString();
        console.log(req.body.fecha_compra_pedido);
        

        // Verificar que los ingredientes y utensilios existan
        const [validationError] = await validateIngredientesYUtensilios(ingredientes, utensilios);
        if (validationError) {
            return handleErrorClient(res, 400, validationError);
        }

        // Llamar al servicio para crear el pedido
        const [newPedido, processedIngredientes, processedUtensilios, serviceError] =
            await createPedidoService(req.body);
        if (serviceError) {
            return handleErrorClient(res, 400, serviceError);
        }

        // Lógica de correo y respuesta
        const proveedor = await obtenerProveedor(newPedido.id_proveedor);

        if (proveedor && proveedor.correo_proveedor) {
            await enviarCorreoProveedor(newPedido, proveedor, processedIngredientes, processedUtensilios);
        }

        handleSuccess(res, 201, "Pedido creado exitosamente", newPedido);
    } catch (error) {
        console.error("Error en el controlador:", error);
        handleErrorServer(res, 500, error.message);
    }
}


// Función auxiliar para enviar correo al proveedor
async function enviarCorreoProveedor(pedido, proveedor, ingredientes, utensilios) {
    const correoProveedor = proveedor.correo_proveedor;
    const datosCorreo = {
        id_pedido: pedido.id_pedido,
        descripcion_pedido: pedido.descripcion_pedido,
        fecha_compra_pedido: pedido.fecha_compra_pedido,
        fecha_entrega_pedido: pedido.fecha_entrega_pedido,
        nombre_usuario: await obtenerNombreUsuario(pedido.id_usuario),
        costo_pedido: pedido.costo_pedido,
        ingredientes: ingredientes.map(ing => ({
            id_ingrediente: ing.id_ingrediente,
            nombre_tipo_ingrediente: ing.nombre_tipo_ingrediente || "Sin tipo",
            cantidad_ingrediente: ing.cantidad_ingrediente,
            costo_ingrediente: ing.costo_ingrediente
        })),
        utensilios: utensilios.map(ut => ({
            id_utensilio: ut.id_utensilio,
            nombre_tipo_utensilio: ut.nombre_tipo_utensilio || "Sin tipo",
            cantidad_utensilio: ut.cantidad_utensilio,
            costo_utensilio: ut.costo_utensilio
        })),
        nombre_proveedor: proveedor.nombre_proveedor
    };

    try {
        await sendEmail(
            correoProveedor,
            "Nuevo Pedido Creado",
            datosCorreo
        );
        console.log(`Correo enviado al proveedor ${correoProveedor}`);
    } catch (error) {
        console.error(`Error enviando correo al proveedor ${correoProveedor}:`, error);
    }
}

// Función auxiliar para obtener el proveedor completo
async function obtenerProveedor(id_proveedor) {
    const proveedorRepository = AppDataSource.getRepository(Proveedor);
    const proveedor = await proveedorRepository.findOneBy({ id_proveedor });
    return proveedor;
}

// Función auxiliar para obtener el nombre del usuario
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

// Controlador para confirmar pedido
export async function confirmarPedidoController(req, res) {
    const { id } = req.params;

    try {
        console.log("Pedido: ", id)

        const pedidoRepository = AppDataSource.getRepository(Pedido);
        const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
        const utensilioRepository = AppDataSource.getRepository(Utensilio);
        const compuestoIngredienteRepository = AppDataSource.getRepository(compuestoIngrediente);
        const compuestoUtensilioRepository = AppDataSource.getRepository(compuestoUtensilio);

        // Obtener el pedido con sus relaciones
        const pedido = await pedidoRepository.findOne({
            where: { id_pedido: id },
            relations: ["compuestoIngredientes", "compuestoUtensilios"],
        });
       
        if (!pedido) {
            return handleErrorClient(res, 404, "Pedido no encontrado.");
        }

        if (pedido.estado_pedido === "Ingresado") {
            return handleErrorClient(res, 400, "El pedido ya está ingresado.");
        }

        // Procesar ingredientes
        const ingredientesPromises = pedido.compuestoIngredientes.map(async (compIngrediente) => {
            // Obtener el ingrediente con sus relaciones
            const ingredienteOriginal = await ingredienteRepository.findOne({
                where: { id_ingrediente: compIngrediente.id_ingrediente },
                relations: ["tipo_ingrediente"],
            });

            if (!ingredienteOriginal) {
                throw new Error(`Ingrediente con ID ${compIngrediente.id_ingrediente} no encontrado.`);
            }

            // Se crea el ingrediente
            const [newIngrediente, errorIngrediente] = await createIngredienteService({
                fecha_vencimiento: new Date(new Date().setDate(new Date().getDate() + 21)), // Fecha 3 semanas más
                cantidad_ingrediente: compIngrediente.cantidad_pedida,
                cantidad_original_ingrediente: compIngrediente.cantidad_pedida,
                costo_ingrediente: ingredienteOriginal.costo_ingrediente,
                id_tipo_ingrediente: ingredienteOriginal.tipo_ingrediente.id_tipo_ingrediente, 
                id_pedido: null
            });

            if (errorIngrediente) {
                console.error(`Error creando ingrediente para el pedido ${id}:`, errorIngrediente);
                throw new Error(`Error creando ingrediente: ${errorIngrediente}`);
            }

            return newIngrediente;
        });

        const ingredientesResult = await Promise.all(ingredientesPromises);
        console.log("Ingredientes creados:", ingredientesResult);

        
        
        

        // Procesar utensilios
        const utensiliosPromises = pedido.compuestoUtensilios.map(async (compUtensilio) => {
            // Obtener el ingrediente con sus relaciones
            const utensilioOriginal = await utensilioRepository.findOne({
                where: { id_utensilio: compUtensilio.id_utensilio },
                relations: ["tipo_utensilio"],
            });

            if (!utensilioOriginal) {
                throw new Error(`Ingrediente con ID ${compUtensilio.id_utensilio} no encontrado.`);
            }

            const [newUtensilio, errorUtensilio] = await createUtensilioService({
                cantidad_utensilio: compUtensilio.cantidad_pedida,
                costo_utensilio: utensilioOriginal.costo_utensilio,
                id_tipo_utensilio: utensilioOriginal.id_tipo_utensilio,
                id_pedido: null,
            });
        
            if (errorUtensilio) {
                console.error(`Error creando utensilio para el pedido ${id}:`, errorUtensilio);
                throw new Error(`Error creando utensilio: ${errorUtensilio}`);
            }
        
            return newUtensilio;
        });

        const utensiliosResult = await Promise.all(utensiliosPromises);
        console.log("Utensilios creados:", utensiliosResult);
        // Cambiar el estado del pedido a "Ingresado" utilizando el servicio
        const [pedidoActualizado, errorEstado] = await updateEstadoPedidoService(id, "Ingresado");

        if (errorEstado) {
            console.error(`Error actualizando el estado del pedido ${id}:`, errorEstado);
            throw new Error(`Error actualizando el estado del pedido: ${errorEstado}`);
        }

        console.log("Estado del pedido actualizado a 'Ingresado':", pedidoActualizado);

        handleSuccess(res, 200, "Pedido confirmado e ingresado exitosamente.", {
            pedido: pedidoActualizado,
            ingredientes: ingredientesResult,
        });
    } catch (error) {
        console.error("Error al confirmar pedido:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateEstadoPedidoController(req, res) {
    const { id } = req.params; // ID del pedido en la URL
    const { nuevoEstado } = req.body; // Nuevo estado enviado en el cuerpo de la solicitud

    try {
        const [pedidoActualizado, error] = await updateEstadoPedidoService(id, nuevoEstado);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Estado del pedido actualizado exitosamente", pedidoActualizado);
    } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

