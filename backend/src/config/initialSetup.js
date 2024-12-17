"use strict";
import Usuario from "../entity/usuario.entity.js";
import horario_laboral from "../entity/horario_laboral.entity.js";
import horario_dia from "../entity/horario_dia.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function initializeData() {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const horarioLaboralRepository = AppDataSource.getRepository(horario_laboral);
    const horarioDiaRepository = AppDataSource.getRepository(horario_dia);

    // Comprobamos si el usuario admin inicial ya existe
    const superUserExists = await usuarioRepository.findOneBy({
      correo_usuario: "superusuario@gmail.com",
    });

    if (superUserExists) {
      console.log("* => El superusuario ya existe. No se realizará ninguna acción.");
      return;
    }

    console.log("* => Iniciando creación de datos iniciales...");

    // Verificar si el horario laboral inicial existe
    let horarioLaboralExistente = await horarioLaboralRepository.findOneBy({
      descripcion: "Horario Administrador",
    });

    // Si no existe, crear el horario laboral y los horarios de día
    if (!horarioLaboralExistente) {
      horarioLaboralExistente = await horarioLaboralRepository.save({
        descripcion: "Horario Administrador",
      });

      const diasSemana = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
      ];

      const horariosDia = diasSemana.map((dia) => ({
        hora_inicio: "00:00:00",
        hora_fin: "23:59:59",
        dia_semana: dia,
        horario_laboral: horarioLaboralExistente,
      }));

      await horarioDiaRepository.save(horariosDia);
      console.log("* => Horario laboral inicial y sus horarios de día creados.");
    } else {
      console.log("* => El horario laboral inicial ya existe.");
    }

    // Crear el superusuario
    const contrasenaEncriptada = await encryptPassword("admin1234");
    await usuarioRepository.save({
      nombre_usuario: "Super",
      apellido_usuario: "Usuario",
      correo_usuario: "superusuario@gmail.com",
      contrasena_usuario: contrasenaEncriptada,
      rol_usuario: "administrador",
      id_horario_laboral: horarioLaboralExistente.id_horario_laboral,
    });

    console.log("* => Superusuario creado exitosamente.");
  } catch (error) {
    console.error("Error durante la inicialización de datos:", error);
  }
}

export { initializeData };
