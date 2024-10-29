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