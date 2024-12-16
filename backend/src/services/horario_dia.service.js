"use strict";
import { AppDataSource } from "../config/configDb.js";
import horario_dia from "../entity/horario_dia.entity.js";
import horario_laboral from "../entity/horario_laboral.entity.js";

export async function createHorarioDiaService(data) {
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);

  try {
    const { id_horario_laboral, hora_inicio, hora_fin, dia_semana } = data;

    // Verifica que el horario laboral exista
    const horarioLaboral = await horarioLaboralRepository.findOneBy({ id_horario_laboral });
    if (!horarioLaboral) {
      return [null, "Horario laboral no encontrado"];
    }

    // Crea el horario_dia sin asociarlo
    let newHorarioDia = horarioDiaRepository.create({
      hora_inicio,
      hora_fin,
      dia_semana
    });

    // Guarda el horario_dia en la base de datos primero
    newHorarioDia = await horarioDiaRepository.save(newHorarioDia);

    // Ahora asocia el horario laboral
    newHorarioDia.horario_laboral = horarioLaboral;
    await horarioDiaRepository.save(newHorarioDia);

    return [newHorarioDia, null];
  } catch (error) {
    console.error("Error al crear horario_dia:", error);
    return [null, error.message];
  }
}



export async function getHorariosDiaService() {
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);
  try {
    const horariosDia = await horarioDiaRepository.find();
    return horariosDia;
  } catch (error) {
    console.error("Error al obtener los horarios día:", error);
    throw new Error("Error interno al obtener los horarios día");
  }
}

export async function getHorarioDiaByIdService(id) {
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);
  try {
    const horarioDia = await horarioDiaRepository.findOneBy({ id_horario_dia: id });
    return horarioDia;
  } catch (error) {
    console.error("Error al obtener el horario día por ID:", error);
    throw new Error("Error interno al obtener el horario día");
  }
}

export async function updateHorarioDiaService(id, data) {
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);

  try {
    const horarioDia = await horarioDiaRepository.findOneBy({ id_horario_dia: id });
    if (!horarioDia) return [null, "Horario día no encontrado"];

    horarioDiaRepository.merge(horarioDia, data);
    await horarioDiaRepository.save(horarioDia);
    return [horarioDia, null];
  } catch (error) {
    console.error("Error al actualizar horario día:", error);
    return [null, error.message];
  }
}

export async function deleteHorarioDiaService(id) {
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);

  try {
    console.log("Intentando eliminar horario día con ID:", id); // LOG

    const horarioDiaExistente = await horarioDiaRepository.findOne({
      where: { id_horario_dia: id },
    });

    if (!horarioDiaExistente) {
      console.log(`Horario día con ID ${id} no existe.`); // LOG
      return [null, `El horario día con ID ${id} no existe.`];
    }

    await horarioDiaRepository.delete(id);
    console.log(`Horario día con ID ${id} eliminado de la base de datos.`); // LOG
    return [true, null];
  } catch (error) {
    console.error("Error en deleteHorarioDiaService:", error.message); // LOG
    return [null, error.message];
  }
}

