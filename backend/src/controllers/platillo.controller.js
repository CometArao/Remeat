"use strtict"
import {
    createPlatillo,
    deletePlatilloById,  
    getPlatilloById,
    getPlatillos,
    updatePlatilloById
      
}
from "../services/platillo.service.js";
import {
    platilloBodyValidation,
}
from "../validations/platillo.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}
from "../handlers/responseHandlers.js";

export async function createPlatilloController(req, res){
    console.log("Keys de req.body:", Object.keys(req.body));

    try{
        const { nombre_platillo,  precio_platillo, id_usuario } = req.body;

        const { error } = platilloBodyValidation.validate({ nombre_platillo,  precio_platillo, id_usuario });

        if(error) return handleErrorClient(res, 400, error.message);

        const [newPlatillo, errorPlatillo] = await createPlatillo({ nombre_platillo,  precio_platillo, id_usuario });

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 201, "Platillo creado", newPlatillo);
    }catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function getPlatillosController(req, res){
    try{
        const [platillos, errorPlatillos] = await getPlatillos();

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

        const [platillo, errorPlatillo] = await getPlatilloById(id_platillo);

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
        const [updatedPlatillo, errorPlatillo] = await updatePlatilloById(id_platillo, { nombre, descripcion, precio, id_categoria });

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

        const [platillo, errorPlatillo] = await deletePlatilloById(id_platillo);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo eliminado", platillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}
