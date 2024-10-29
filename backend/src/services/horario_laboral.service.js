"use strict";
import { AppDataSource } from "../config/configDb.js";
import horario_laboral from "../entity/horario_laboral.entity.js";
import horario_dia from "../entity/horario_dia.entity.js";

export async function createHorarioLaboralService(data) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);

  try {
    const newHorarioLaboral = horarioLaboralRepository.create(data);
    await horarioLaboralRepository.save(newHorarioLaboral);
    return [newHorarioLaboral, null];
  } catch (error) {
    console.error("Error al crear horario laboral:", error);
    return [null, error.message];
  }
}

// Obtener todos los horarios laborales
export async function getHorariosLaboralesService() {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
  try {
    const horariosLaborales = await horarioLaboralRepository.find({
      relations: { horario_dia: true }
    });
    return horariosLaborales;
  } catch (error) {
    console.error("Error al obtener los horarios laborales:", error);
    throw new Error("Error interno al obtener los horarios laborales");
  }
}

// Obtener un horario laboral específico por ID
export async function getHorarioLaboralByIdService(id) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
  try {
    const horarioLaboral = await horarioLaboralRepository.findOne({
      where: { id_horario_laboral: id },
      relations: { horario_dia: true }
    });
    return horarioLaboral;
  } catch (error) {
    console.error("Error al obtener el horario laboral por ID:", error);
    throw new Error("Error interno al obtener el horario laboral");
  }
}

export async function updateHorarioLaboralService(id, data) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);

  try {
    const horarioLaboral = await horarioLaboralRepository.findOneBy({ id_horario_laboral: id });
    if (!horarioLaboral) return [null, "Horario laboral no encontrado"];

    horarioLaboralRepository.merge(horarioLaboral, data);
    await horarioLaboralRepository.save(horarioLaboral);
    return [horarioLaboral, null];
  } catch (error) {
    console.error("Error al actualizar horario laboral:", error);
    return [null, error.message];
  }
}

export async function deleteHorarioLaboralService(id) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);

  try {
    const result = await horarioLaboralRepository.delete(id);
    if (result.affected === 0) return [null, "Horario laboral no encontrado"];

    return [true, null];
  } catch (error) {
    console.error("Error al eliminar horario laboral:", error);
    return [null, error.message];
  }
}