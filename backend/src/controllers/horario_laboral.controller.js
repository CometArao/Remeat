"use strict";
import {
  createHorarioLaboralService,
  deleteHorarioLaboralService,
  getHorarioLaboralByIdService,
  getHorariosLaboralesService,
  updateHorarioLaboralService
} from "../services/horario_laboral.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { deleteHorarioDiaService } from "../services/horario_dia.service.js";

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
    const { horario_dia, descripcion, horariosDia = [] } = req.body; // Default a un array vacío si no existe

    console.log("Payload recibido en el backend:", req.body); // LOG
    console.log("Días a mantener:", horariosDia); // LOG

    // 1. Obtener el horario laboral completo desde el backend con sus días actuales
    const horarioLaboralExistente = await getHorarioLaboralByIdService(id_horario_laboral);
    if (!horarioLaboralExistente) {
      return handleErrorClient(res, 404, "Horario laboral no encontrado.");
    }

    const diasActuales = horarioLaboralExistente.horario_dia || []; // Horarios día actuales
    console.log("Días actuales en la BD:", diasActuales); // LOG

    // 2. Extraer los IDs de días que hay que mantener
    const idsDiasPayload = horariosDia.map((dia) => dia.id_horario_dia).filter(Boolean); // IDs recibidos
    console.log("IDs de días a mantener:", idsDiasPayload); // LOG

  
    // 3. Identificar días a eliminar: días actuales que NO están en los días a mantener
    const diasAEliminar = diasActuales
      .filter((dia) => !idsDiasPayload.includes(dia.id_horario_dia)) // Excluir días que hay que mantener
      .map((dia) => dia.id_horario_dia); // Extraer solo los IDs

    console.log("IDs de días a eliminar:", diasAEliminar); // LOG

    // 4. Eliminar los días que no se deben mantener
    for (const id of diasAEliminar) {
      const [deleted, deleteError] = await deleteHorarioDiaService(id);
      if (deleteError) {
        console.error(`Error eliminando horario día con ID ${id}:`, deleteError);
      } else {
        console.log(`Horario día con ID ${id} eliminado correctamente.`);
      }
    }

    // 5. Actualizar el horario laboral con los días restantes y la nueva descripción
    const [updatedHorarioLaboral, error] = await updateHorarioLaboralService(id_horario_laboral, {
      descripcion,
      horariosDia,
    });

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    handleSuccess(res, 200, "Horario laboral actualizado exitosamente", updatedHorarioLaboral);
  } catch (error) {
    console.error("Error en updateHorarioLaboral:", error.message); // LOG
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
