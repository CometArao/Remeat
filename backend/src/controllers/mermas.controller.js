"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createMermaService, getMermasService, getMermaService, updateMermaService, deleteMermaService } from "../services/merma.service.js"
import { mermaValidation, mermaQueryValidation } from "../validations/merma.validation.js"
import { tipo_utensilioValidation, tipo_utensilioQueryValidation, utensilioValidation, utensilioQueryValidation } from "../validations/utensilio.validation.js"

export async function createMerma(req, res) {
    try {
        const {body} = req 
        const {error} = mermaValidation.validate(body) 
        if(error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }
        const [nuevaMerma, errorTipoUtensilio] = await createMermaService(body);

        if(errorTipoUtensilio) {
            return handleErrorClient(res, 400, "Error creando merma", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "merma creada correctamente", nuevaMerma)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getMerma(req, res) {
    try {
        const id_merma = req.params.id;
        const [MermaEncontrada, error] = await getMermaService(id_merma);
        console.log("test")
        if(error) {
            handleErrorClient(res, 400, "merma no encontrada", error);
        }
        return handleSuccess(res, 200, "merma enviada exitosamente", MermaEncontrada)

    }catch(error) {
        return handleErrorServer(res, 500, error.message);
    }

    
}

export async function getMermasService(req, res) {
    try {
        const [isDeleted, errorMerma] = await deleteMermasService();
        if (!isDeleted) {
            return handleErrorClient(res, 400, "No se pudo borrar la merma");
        }
        if(errorMerma) {
            return handleErrorClient(res, 400, "Error en la consulta", errorMerma);
        }
        handleSuccess(res, 201, "merma encontradas exitosamente", mermas)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function updateMerma(req, res) {
    try {
        const {body} = req 
        const {error} = mermaValidation.validate(body) 
        if(error) {
            return handleErrorClient(res, 400, "Error de validacion", errorMerma);
        }
        console.log("service")
        const [merma, errorMerma] = await updateMermaService(body);
        console.log(merma)
        if(errorMerma) {
            return handleErrorClient(res, 400, "Error en la consulta", errorMerma);
        }

        return handleSuccess(res, 200, "merma editada exitosamente", merma)
    }catch(error) {
        console.log(error)
        handleErrorServer(res, 500, error.message);
    }
}
export async function deleteMerma(req, res) {
    console.log("test")
    try {
        const id_merma = req.params.id;
        const {errorValidacion} = mermaQueryValidation.validate(id_merma);
        if(errorValidacion) {
            return handleErrorClient(res, 400, 
                "no se especifico la id de la merma a eliminar", errorValidacion);
        }
        const [MermaEncontrada, error] = await deleteMermaService(id_merma)
        if(error) {
            return handleErrorClient(res, 400, "no se pudo eliminar merma", error)
        }
        return handleSuccess(res, 200, "merma eliminada exitosamente", MermaEncontrada);
    }catch(error) {
        return handleErrorServer(res, 500, error.message);
    }
}