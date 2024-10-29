"use strict";
import { createHorarioDiaService } from "../services/horario_dia.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createHorarioDia(req, res) {
  try {
    const [newHorarioDia, error] = await createHorarioDiaService(req.body);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Horario día creado exitosamente", newHorarioDia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}