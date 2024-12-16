"use strict";
import { AppDataSource } from "../config/configDb.js";
import horario_laboral from "../entity/horario_laboral.entity.js";
import horario_dia from "../entity/horario_dia.entity.js";
import Usuario from "../entity/usuario.entity.js";

export async function createHorarioLaboralService(data) {
  console.log("Datos recibidos en el servicio:", data);

  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);

  try {
    const { descripcion, horario_dia } = data;

    // Validaciones
    if (!descripcion) {
      throw new Error("La descripción del horario laboral es obligatoria.");
    }

    if (!horario_dia || !Array.isArray(horario_dia) || horario_dia.length === 0) {
      throw new Error("Debes agregar al menos un horario de día.");
    }

    // Crear el horario laboral
    const newHorarioLaboral = horarioLaboralRepository.create({ descripcion });
    const savedHorarioLaboral = await horarioLaboralRepository.save(newHorarioLaboral);

    const diasSemanaValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    const horariosDiaAsociados = [];

    // Iterar sobre cada horario_dia y crearlo sin validación previa
    for (const horario of horario_dia) {
      const dia = horario.dia_semana.toLowerCase();

      // Validación de día de la semana
      if (!diasSemanaValidos.includes(dia)) {
        throw new Error(`El día '${horario.dia_semana}' no es válido.`);
      }

      // Validación de hora
      if (horario.hora_inicio >= horario.hora_fin) {
        throw new Error(
          `La hora de inicio (${horario.hora_inicio}) debe ser menor que la hora de fin (${horario.hora_fin}) 
          para el día ${horario.dia_semana}.`
        );
      }

      // Crear el horario_dia directamente
      const newHorarioDia = horarioDiaRepository.create({
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        dia_semana: dia,
        horario_laboral: savedHorarioLaboral, // Asociar al horario laboral
      });

      await horarioDiaRepository.save(newHorarioDia);
      horariosDiaAsociados.push(newHorarioDia);
    }

    // Evitar referencia circular
    const sanitizedHorariosDia = horariosDiaAsociados.map(({ horario_laboral, ...rest }) => rest);

    return [
      {
        id_horario_laboral: savedHorarioLaboral.id_horario_laboral,
        descripcion: savedHorarioLaboral.descripcion,
        horario_dia: sanitizedHorariosDia,
      },
      null,
    ];
  } catch (error) {
    console.error("Error al crear horario laboral y horarios de día:", error);
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
  console.log(`Buscando horario laboral con ID: ${id}`);
  try {
    const horarioLaboral = await horarioLaboralRepository.findOne({
      where: { id_horario_laboral: id }, // Filtra por la ID
      relations: { horario_dia: true } // Incluye la relación con `horario_dia`
    });

    return horarioLaboral;
  } catch (error) {
    console.error("Error al obtener el horario laboral por ID:", error);
    throw new Error("Error interno al obtener el horario laboral");
  }
}


export async function updateHorarioLaboralService(id, data) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
  const horarioDiaRepository = AppDataSource.getRepository(horario_dia);

  try {
    const horarioLaboral = await horarioLaboralRepository.findOne({
      where: { id_horario_laboral: id },
      relations: { horario_dia: true },
    });

    if (!horarioLaboral) return [null, "Horario laboral no encontrado"];

    const { descripcion, horariosDia } = data;

    // Validación de días duplicados y días válidos
    if (horariosDia && Array.isArray(horariosDia)) {
      const diasValidos = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];
      const diasUnicos = new Set();

      for (const dia of horariosDia) {
        if (!diasValidos.includes(dia.dia_semana)) {
          return [null, `Día inválido: ${dia.dia_semana}. Solo se permiten días de lunes a domingo.`];
        }
        if (diasUnicos.has(dia.dia_semana)) {
          return [null, `Día duplicado: ${dia.dia_semana}. No se permiten días repetidos.`];
        }
        diasUnicos.add(dia.dia_semana);
      }
    }

    // Actualizar descripción si está presente
    if (descripcion) horarioLaboral.descripcion = descripcion;

    if (horariosDia) {
      // Identificar días que deben eliminarse
      const diasExistentes = horarioLaboral.horario_dia.map((dia) => dia.dia_semana);
      const diasNuevos = horariosDia.map((dia) => dia.dia_semana);

      const diasAEliminar = horarioLaboral.horario_dia.filter(
        (dia) => !diasNuevos.includes(dia.dia_semana)
      );

      // Eliminar días que ya no están
      if (diasAEliminar.length > 0) {
        const idsAEliminar = diasAEliminar.map((dia) => dia.id_horario_dia);
        await horarioDiaRepository.delete(idsAEliminar);
      }

      // Actualizar o agregar días
      for (const dia of horariosDia) {
        const diaExistente = horarioLaboral.horario_dia.find(
          (d) => d.dia_semana === dia.dia_semana
        );

        if (diaExistente) {
          // Actualizar día existente
          diaExistente.hora_inicio = dia.hora_inicio.slice(0, 5); // Solo HH:mm
          diaExistente.hora_fin = dia.hora_fin.slice(0, 5); // Solo HH:mm
          await horarioDiaRepository.save(diaExistente);
        } else {
          // Crear un nuevo día
          const nuevoHorarioDia = horarioDiaRepository.create({
            ...dia,
            horario_laboral: horarioLaboral,
            hora_inicio: dia.hora_inicio.slice(0, 5),
            hora_fin: dia.hora_fin.slice(0, 5),
          });
          await horarioDiaRepository.save(nuevoHorarioDia);
          horarioLaboral.horario_dia.push(nuevoHorarioDia);
        }
      }
    }

    // Guardar cambios en el horario laboral
    await horarioLaboralRepository.save(horarioLaboral);

    return [horarioLaboral, null];
  } catch (error) {
    console.error("Error al actualizar horario laboral:", error);
    return [null, error.message];
  }
}


export async function deleteHorarioLaboralService(id) {
  const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
  const usuarioRepository = AppDataSource.getRepository(Usuario); // Repositorio de usuarios, ajusta según tu modelo

  try {
      // Verificar que el horario laboral exista
      const horarioLaboralExistente = await horarioLaboralRepository.findOne({
          where: { id_horario_laboral: id },
      });

      if (!horarioLaboralExistente) {
          return [null, `El horario laboral con ID ${id} no existe.`];
      }

      // Verificar si el horario laboral está enlazado a algún usuario
      const usuarioEnlazado = await usuarioRepository.findOne({
          where: { horario_laboral: { id_horario_laboral: id } }, // Ajusta el campo según tu relación
      });

      if (usuarioEnlazado) {
          return [null, `No se puede eliminar este horario laboral 
            porque está siendo utilizado por uno o más usuarios.`];
      }

      // Intentar eliminar el horario laboral
      await horarioLaboralRepository.delete(id);
      return [true, null];
  } catch (error) {
      // Verificar si el error es de clave foránea
      if (error.code === "23503") { // Código de error para violación de clave foránea en PostgreSQL
          return [null, `No se puede eliminar este horario laboral 
            porque está siendo utilizado en otros registros.`];
      }
      console.error("Error al eliminar el horario laboral:", error);
      return [null, error.message];
  }
}
