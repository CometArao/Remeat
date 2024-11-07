"use strict";
import User from "../entity/usuario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ correo_usuario: req.user.correo_usuario });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (userFound.rol_usuario !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isChef(req, res, next) {

  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ correo_usuario: req.user.correo_usuario });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (userFound.rol_usuario !== "cocinero") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de cocinero para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isWaiter(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({ correo_usuario: req.user.correo_usuario });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    if (userFound.rol_usuario !== "mesero") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de mesero para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}