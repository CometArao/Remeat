"use strict";
import { 
    createTipoUtensilioService, getTiposUtensilioService, updateTipoUtensilioService, deleteTipoUtensilioService,
    createUtensilioService, getUtensiliosService, updateUtensilioService, deleteUtensilioService,
    getTipoUtensilioService, getUtensilioService
} from "../services/utensilio.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { utensilioQueryValidation, utensilioValidation, utensilioEditValidation,
    tipo_utensilioQueryValidation, tipo_utensilioValidation } from "../validations/utensilio.validation.js";

// Controladores para Tipo de Utensilio
export async function createTipoUtensilioController(req, res) {
    try {
        const { error } = tipo_utensilioValidation.validate(req.body)
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        const [newTipoUtensilio, errorService] = await createTipoUtensilioService(req.body);
        if (errorService) return handleErrorClient(res, 400, errorService);
        handleSuccess(res, 201, "Tipo de utensilio creado exitosamente", newTipoUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getTiposUtensilioController(req, res) {
    try {
        const [tiposUtensilio, error] = await getTiposUtensilioService();
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Lista de tipos de utensilio", tiposUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getTipoUtensilioController(req, res) {
    try {
        const id = req.params.id
        const { error: errorValidacion } = tipo_utensilioQueryValidation.validate({ id_tipo_utensilio: id})
        if(errorValidacion) {
            return handleErrorClient(res, 400, errorValidacion.message)
        }
        const [tipoUtensilio, error] = await getTipoUtensilioService(req.params.id);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Tipo de utensilio encontrado", tipoUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateTipoUtensilioController(req, res) {
    try {
        const { error: errorValidacion } = tipo_utensilioQueryValidation.validate(req.params.id)
        const { error: errorValidacion2 } = tipo_utensilioValidation.validate(req.body)
        if(errorValidacion) {
            return handleErrorClient(res, 400, errorValidacion.message)
        }
        if(errorValidacion2) {
            return handleErrorClient(res, 400, errorValidacion2.message)
        }
        const [updatedTipoUtensilio, error] = await updateTipoUtensilioService(req.params.id, req.body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Tipo de utensilio actualizado", updatedTipoUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteTipoUtensilioController(req, res) {
    try {
        const id = req.params.id
        const { error: errorValidacion } = tipo_utensilioQueryValidation.validate({ id_tipo_utensilio: id })
        if(errorValidacion) {
            return handleErrorClient(res, 400, errorValidacion.message)
        }
        const [isDeleted, error] = await deleteTipoUtensilioService(req.params.id);
        if (error || !isDeleted) return handleErrorClient(res, 400, error || "Tipo de utensilio no encontrado");
        handleSuccess(res, 200, "Tipo de utensilio eliminado");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controladores para Utensilio
export async function createUtensilioController(req, res) {
    try {
        const { error }  = utensilioValidation.validate(req.body)
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        const [newUtensilio, errorServicio] = await createUtensilioService(req.body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 201, "Utensilio creado exitosamente", newUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getUtensiliosController(req, res) {
    try {
        const [utensilios, error] = await getUtensiliosService();
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Lista de utensilios", utensilios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getUtensiliosDetalladoController(req, res) {
    try {
        const [utensilios, error] = await getUtensiliosDetalladoService();
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Lista de utensilios", utensilios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getUtensilioController(req, res) {
    try {
        const id = req.params.id
        const { error } = utensilioQueryValidation.validate({ id_utensilio: id }); 
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        const [utensilio, errorService] = await getUtensilioService(req.params.id);
        if (errorService) return handleErrorClient(res, 400, errorService);
        handleSuccess(res, 200, "Utensilio encontrado", utensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateUtensilioController(req, res) {
    try {
        const id = req.params.id
        let { error } = utensilioQueryValidation.validate({ id_utensilio: id})
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        ({ error } = utensilioEditValidation.validate(req.body))//esta en parentesis por la destructuracion de variable repetida
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        const [updatedUtensilio, errorService] = await updateUtensilioService(req.params.id, req.body);
        if (errorService) return handleErrorClient(res, 400, errorService);
        handleSuccess(res, 200, "Utensilio actualizado", updatedUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteUtensilioController(req, res) {
    try {
        const id = req.params.id
        const { error } = utensilioQueryValidation.validate({ id_utensilio: id})
        if(error) {
            return handleErrorClient(res, 400, error.message)
        }
        const [isDeleted, errorService] = await deleteUtensilioService(req.params.id);
        if (errorService || !isDeleted) return handleErrorClient(res, 400, errorService || "Utensilio no encontrado");
        handleSuccess(res, 200, "Utensilio eliminado");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
