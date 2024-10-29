"use strict";
import User from "../entity/usuario.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { correo_usuario, contrasena_usuario } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { correo_usuario }
    });

    if (!userFound) {
      return [null, createErrorMessage("correo_usuario", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(contrasena_usuario, userFound.contrasena_usuario);

    if (!isMatch) {
      return [null, createErrorMessage("contrasena_usuario", "La contraseña es incorrecta")];
    }

    const payload = {
      nombre_usuario: userFound.nombre_usuario,
      apellido_usuario: userFound.apellido_usuario,
      correo_usuario: userFound.correo_usuario,
      rol_usuario: userFound.rol_usuario,
    };

    // Genera el token con expiración de 30 días
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "30d", // Token expira en 30 días
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombre_usuario, apellido_usuario, correo_usuario, contrasena_usuario, 
      rol_usuario, id_horario_laboral } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        correo_usuario,
      },
    });
    
    if (existingEmailUser) {
      return [null, createErrorMessage("correo_usuario", "Correo electrónico en uso")];
    }

    const newUser = userRepository.create({
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      contrasena_usuario: await encryptPassword(user.contrasena_usuario),
      rol_usuario,
      id_horario_laboral
    });

    await userRepository.save(newUser);

    const { contrasena_usuario: _, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
