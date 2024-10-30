"use strtict"
import {
    assignPriceToPlatilloService,
    createPlatilloService,
    deletePlatilloByIdService,  
    getPlatilloByIdService,
    getPlatillosService,
    updatePlatilloByIdService
} from "../services/platillo.service.js";
import {
    platilloBodyValidation,
    platilloPrecioValidation
} from "../validations/platillo.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createPlatilloController(req, res) {
    try {
        const { nombre_platillo, id_usuario, disponible = true, ingredientes } = req.body;

        const { error } = platilloBodyValidation.validate({ nombre_platillo, id_usuario });
        if (error) return handleErrorClient(res, 400, error.message);

        const [newPlatillo, errorPlatillo] = await createPlatilloService({
            nombre_platillo,
            disponible,
            id_usuario,
            ingredientes
        });

        if (errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 201, "Platillo creado", newPlatillo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function assignPriceToPlatilloController(req, res) {
    try {
        const { id_platillo, precio_platillo } = req.body;
        const { error } = platilloPrecioValidation.validate({ precio_platillo });

        // Verificar si el usuario es administrador
        if (req.user.rol_usuario !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permiso para asignar precio a un platillo.");
        }

        // Validar el precio del platillo para asegurar que no es negativo
        if (error) {
            return handleErrorClient(res, 400, error.message);
        }

        const [updatedPlatillo, serviceError] = await assignPriceToPlatilloService({ id_platillo, precio_platillo });

        if (serviceError) return handleErrorClient(res, 404, serviceError);

        handleSuccess(res, 200, "Precio asignado al platillo exitosamente", updatedPlatillo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function getPlatillosController(req, res){
    try{
        const [platillos, errorPlatillos] = await getPlatillosService();

        if(errorPlatillos) return handleErrorClient(res, 404, errorPlatillos);

        platillos.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Platillos encontrados", platillos);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function getPlatilloByIdController(req, res){
    try{
        const { id_platillo } = req.params;

        const [platillo, errorPlatillo] = await getPlatilloByIdService(id_platillo);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo encontrado", platillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function updatePlatilloController(req, res){
    try{
        const { id_platillo } = req.params;
        const { nombre, precio, id_usuario } = req.body;

        const { error } = platilloBodyValidation.validate({ nombre_platillo, precio_platillo, id_usuario });

        if(error) return handleErrorClient(res, 400, error.message);

        // eslint-disable-next-line max-len
        const [updatedPlatillo, errorPlatillo] = await updatePlatilloByIdService(id_platillo, { nombre, descripcion, precio, id_categoria });

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo actualizado", updatedPlatillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function deletePlatilloController(req, res){
    try{
        const { id_platillo } = req.params;

        const [platillo, errorPlatillo] = await deletePlatilloByIdService(id_platillo);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo eliminado", platillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}
