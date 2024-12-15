"use strict";
import { createHorarioDiaService, getHorariosDiaService, 
  getHorarioDiaByIdService, 
  updateHorarioDiaService, 
  deleteHorarioDiaService  } from "../services/horario_dia.service.js";
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

// Obtener todos los horarios_dia
export async function getHorariosDia(req, res) {
  try {
    const horariosDia = await getHorariosDiaService();
    handleSuccess(res, 200, "Horarios día obtenidos", horariosDia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener un horario_dia por ID
export async function getHorarioDiaById(req, res) {
  try {
    const { id } = req.params;
    const horarioDia = await getHorarioDiaByIdService(id);

    if (!horarioDia) {
      return handleErrorClient(res, 404, "Horario día no encontrado");
    }

    handleSuccess(res, 200, "Horario día obtenido", horarioDia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un horario_dia por ID
export async function updateHorarioDia(req, res) {
  try {
    const { id } = req.params;
    const [updatedHorarioDia, error] = await updateHorarioDiaService(id, req.body);
    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Horario día actualizado exitosamente", updatedHorarioDia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un horario_dia por ID
export async function deleteHorarioDia(req, res) {
  try {
      const { id } = req.params;

      if (!id) {
          return handleErrorClient(
              res,
              400,
              "ID del horario día no proporcionado."
          );
      }

      const [deletedHorarioDia, errorHorarioDia] =
          await deleteHorarioDiaService(id);

      if (errorHorarioDia) {
          return handleErrorClient(
              res,
              400,
              "Error eliminando horario día",
              errorHorarioDia
          );
      }

      handleSuccess(
          res,
          200,
          "Horario día eliminado exitosamente",
          deletedHorarioDia
      );
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}
