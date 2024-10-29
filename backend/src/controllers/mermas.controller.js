"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getUtensiliosDeTipoService } from "../services/graph.service.js"
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
            return handleErrorClient(res, 400, "Error creando Utensilio", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "Tipo utensilio creado correctamente", nuevaMerma)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMermas(req, res) {
    try {
        const [mermas, errorMerma] = await getMermasService(id_merma);

        if(errorMerma) {
            return handleErrorClient(res, 400, "Error en la consulta", errorMerma);
        }
        handleSuccess(res, 201, "Tipo utensilio creado correctamente", mermas)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}