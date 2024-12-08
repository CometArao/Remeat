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

export async function isMesero(req, res, next) {
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

export const authorizeRoles = (roles) => (req, res, next) => {
  const userRole = req.user?.rol_usuario;

  if (roles.includes(userRole)) {
    return next();
  } else {
    console.warn(
      `Acceso denegado. Rol del usuario: ${userRole}. Roles permitidos: ${roles.join(", ")}`
    );
    return res.status(403).json({ message: "No tienes permisos para acceder." });
  }
};
