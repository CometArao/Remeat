"use strict";
import { 
    createTipoUtensilioService, getTiposUtensilioService, updateTipoUtensilioService, deleteTipoUtensilioService,
    createUtensilioService, getUtensiliosService, updateUtensilioService, deleteUtensilioService,
    getTipoUtensilioService, getUtensilioService
} from "../services/utensilio.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Controladores para Tipo de Utensilio
export async function createTipoUtensilioController(req, res) {
    try {
        const [newTipoUtensilio, error] = await createTipoUtensilioService(req.body);
        if (error) return handleErrorClient(res, 400, error);
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
        const [tipoUtensilio, error] = await getTipoUtensilioService(req.params.id);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Tipo de utensilio encontrado", tipoUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateTipoUtensilioController(req, res) {
    try {
        const [updatedTipoUtensilio, error] = await updateTipoUtensilioService(req.params.id, req.body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Tipo de utensilio actualizado", updatedTipoUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteTipoUtensilioController(req, res) {
    try {
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
        const [newUtensilio, error] = await createUtensilioService(req.body);
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

export async function getUtensilioController(req, res) {
    try {
        const [utensilio, error] = await getUtensilioService(req.params.id);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Utensilio encontrado", utensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateUtensilioController(req, res) {
    try {
        const [updatedUtensilio, error] = await updateUtensilioService(req.params.id, req.body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Utensilio actualizado", updatedUtensilio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteUtensilioController(req, res) {
    try {
        const [isDeleted, error] = await deleteUtensilioService(req.params.id);
        if (error || !isDeleted) return handleErrorClient(res, 400, error || "Utensilio no encontrado");
        handleSuccess(res, 200, "Utensilio eliminado");
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
