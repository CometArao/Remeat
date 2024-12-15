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
    const { descripcion, horario_dia } = req.body; // Cambiado de horariosDia a horario_dia

    // Llama al servicio para manejar la lógica
    const [newHorarioLaboral, error] = await createHorarioLaboralService({
      descripcion,
      horario_dia,
    });

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    handleSuccess(
      res,
      201,
      "Horario laboral y horarios de día creados exitosamente",
      newHorarioLaboral
    );
  } catch (error) {
    console.error("Error al crear horario laboral:", error);
    handleErrorServer(res, 500, "Error interno al crear horario laboral.");
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

export async function getHorarioLaboralById(req, res) {
  try {
    const { id_horario_laboral } = req.params; // Obtiene la ID de los parámetros de la URL
    const horarioLaboral = await getHorarioLaboralByIdService(id_horario_laboral);

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
    const { id_horario_laboral } = req.params;
    const [updatedHorarioLaboral, error] = await updateHorarioLaboralService(id_horario_laboral, req.body);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    handleSuccess(res, 200, "Horario laboral actualizado exitosamente", updatedHorarioLaboral);
  } catch (error) {
    console.error("Error al actualizar horario laboral:", error);
    handleErrorServer(res, 500, error.message);
  }
}


export async function deleteHorarioLaboral(req, res) {
  try {
      const { id_horario_laboral } = req.params;

      if (!id_horario_laboral) {
          return handleErrorClient(
              res,
              400,
              "ID del horario laboral no proporcionado."
          );
      }

      const [deletedHorarioLaboral, errorHorarioLaboral] =
          await deleteHorarioLaboralService(id_horario_laboral);

      if (errorHorarioLaboral) {
          return handleErrorClient(
              res,
              400,
              "Error eliminando horario laboral",
              errorHorarioLaboral
          );
      }

      handleSuccess(
          res,
          200,
          "Horario laboral eliminado exitosamente",
          deletedHorarioLaboral
      );
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}
