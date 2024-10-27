"use strict";
import Usuario from "../entity/usuario.entity.js";
import horario_laboral from "../entity/horario_laboral.entity.js";
import horario_dia from "../entity/horario_dia.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const count = await usuarioRepository.count();
    if (count > 0) return;

    await Promise.all([
      usuarioRepository.save(
        usuarioRepository.create({
          nombre_usuario: "admin",
          apellido_usuario: "master",
          correo_usuario: "cometarao@gmail.com",
          contrasena_usuario: await encryptPassword("admin1234"),
          rol_usuario: "administrador",
        }),
      )
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createHorario(horario_dia) {
  try {
    const userRepository = AppDataSource.getRepository(horario_laboral);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          descripcion: "test",
          horario_dia: [horario_dia, ]
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}
async function createHorario_dia() {
  try {
    const userRepository = AppDataSource.getRepository(horario_dia);

    const count = await userRepository.count();
    if (count > 0) return;

    let horario = {
          hora_inicio: 1,
          hora_fin: 1,
          dia_semana: "martes",
    }
    await Promise.all([
      userRepository.save(horario),
    ]);
    console.log("* => Usuarios creados exitosamente");
    return horario;
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers, createHorario, createHorario_dia};
