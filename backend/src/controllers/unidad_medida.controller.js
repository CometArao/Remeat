"use strict";
import {
    createUnidadMedidaService,
    deleteUnidadMedidaService,
    getUnidadesMedidasService,
    getUnidadMedidaByIdService,
    updateUnidadMedidaService
}
from "../services/unidad_medida.service.js";

import {
    medidaBodyValidation,
    medidaQueryValidation,
}
from "../validations/unidad_medida.validation.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}
from "../handlers/responseHandlers.js";

export async function createMedidaController(req, res) {
    console.log("createMedidaController");
    try {
        const { nombre_unidad_medida } = req.body;
        console.log(nombre_unidad_medida);

        const { error } = medidaBodyValidation.validate({ nombre_unidad_medida });

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [newMedida, errorMedida] = await createUnidadMedidaService({ nombre_unidad_medida });

        if (errorMedida) {
            return handleErrorClient(res, 400, errorMedida); // Envía el error específico
        }

        handleSuccess(res, 201, "Medida creada exitosamente", newMedida);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function getMedidasController(req, res) {
    try {
      const [medidas, errorMedidas] = await getUnidadesMedidasService();
  
      if (errorMedidas) {
        return handleErrorClient(res, 404, errorMedidas);
      }
  
      handleSuccess(res, 200, "Medidas obtenidas exitosamente", medidas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }

export async function getMedidaByIdController(req, res) {
    try {
        const { id } = req.params;

        const { error } = medidaQueryValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);

        const [medida, errorMedida] = await getUnidadMedidaByIdService(id);

        if (errorMedida) return handleErrorClient(res, 404, errorMedida);

        handleSuccess(res, 200, "Medida obtenida exitosamente", medida);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function updateMedidaController(req, res) {
    try {
        const { id } = req.params;
        const { nombre_unidad_medida } = req.body;

        const { error } = medidaBodyValidation.validate({ nombre_unidad_medida });

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [updatedMedida, errorMedida] = await updateUnidadMedidaService(id, { nombre_unidad_medida });

        if (errorMedida) {
            return handleErrorClient(res, 400, errorMedida); // Envía el error específico
        }

        handleSuccess(res, 200, "Medida actualizada exitosamente", updatedMedida);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function deleteMedidaController(req, res) {
    try {
        const { id } = req.params;

        const { error } = medidaQueryValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);

        const [deletedMedida, errorMedida] = await deleteUnidadMedidaService(id);

        if (errorMedida) return handleErrorClient(res, 400, errorMedida, 
            { status: "Client error", message: errorMedida });

        handleSuccess(res, 200, "Medida eliminada exitosamente", deletedMedida);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
