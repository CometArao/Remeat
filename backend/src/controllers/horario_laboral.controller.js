"use strict";
import {
  createHorarioLaboralService,
  deleteHorarioLaboralService,
  getHorarioLaboralByIdService,
  getHorariosLaboralesService,
  updateHorarioLaboralService
} from "../services/horario_laboral.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createHorarioLaboral(req, res) {
  try {
    const [newHorarioLaboral, error] = await createHorarioLaboralService(req.body);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Horario laboral creado exitosamente", newHorarioLaboral);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los horarios laborales
export async function getHorariosLaborales(req, res) {
  try {
    const horariosLaborales = await getHorariosLaboralesService();
    handleSuccess(res, 200, "Horarios laborales obtenidos", horariosLaborales);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener un horario laboral específico por ID
export async function getHorarioLaboralById(req, res) {
  try {
    const { id } = req.params;
    const horarioLaboral = await getHorarioLaboralByIdService(id);

    if (!horarioLaboral) {
      return handleErrorClient(res, 404, "Horario laboral no encontrado");
    }

    handleSuccess(res, 200, "Horario laboral obtenido", horarioLaboral);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateHorarioLaboral(req, res) {
  try {
    const { id } = req.params;
    const [updatedHorarioLaboral, error] = await updateHorarioLaboralService(id, req.body);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Horario laboral actualizado exitosamente", updatedHorarioLaboral);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteHorarioLaboral(req, res) {
  try {
    const { id } = req.params;
    const [deleted, error] = await deleteHorarioLaboralService(id);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Horario laboral eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}