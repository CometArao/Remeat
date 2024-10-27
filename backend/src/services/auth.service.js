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

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
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

    const { nombre_usuario, apellido_usuario, correo_usuario, contrasena_usuario, rol_usuario } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        correo_usuario,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("correo_usuario", "Correo electrónico en uso")];

    const newUser = userRepository.create({
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      contrasena_usuario: await encryptPassword(user.contrasena_usuario),
      rol_usuario
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
