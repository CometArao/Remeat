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

    parcheInicio();
    console.log("* => Usuarios creados exitosamente");
    return

    await Promise.all([
      usuarioRepository.save(
        usuarioRepository.create({
          nombre_usuario: "Juan Pablo",
          apellido_usuario: "Rosas",
          correo_usuario: "juanrosas@gmail.com",
          contrasena_usuario: await encryptPassword("admin1234"),
          rol_usuario: "administrador",
          id_horario_laboral: 2,
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
    const horarioRespository = AppDataSource.getRepository(horario_laboral);

    const count = await horarioRespository.count();
    if (count > 0) return;

    await Promise.all([
      horarioRespository.save(
        horarioRespository.create({
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

export { createUsers, createHorario, createHorario_dia };

async function parcheInicio() {
  //Crear horario laboral
  const horarioLaboral = await AppDataSource.query(`
  INSERT INTO horario_laboral (descripcion)  
  VALUES ('Horario Administrador')
  RETURNING id_horario_laboral
  `)
  //Crear horario dia
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  for(let i = 0; i < dias.length; i++) {
    await AppDataSource.query(`
    insert into horario_dia (hora_inicio, hora_fin, dia_semana, id_horario_laboral)
    values ('00:00:00', '23:59:59', $2, $1)
    `, [horarioLaboral[0].id_horario_laboral, dias[i]])
  }
  //Crear usuario
  const constrasenna = await encryptPassword("admin1234");
  const usuario = await AppDataSource.query(`
  INSERT INTO usuario (nombre_usuario, apellido_usuario,
  correo_usuario, contrasena_usuario, rol_usuario, id_horario_laboral)
  VALUES ('Super', 'Usuario', 'superusuario@gmail.com', $1, 'administrador', $2)
  `, [constrasenna, horarioLaboral[0].id_horario_laboral])
  return
}