"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
} from "../services/usuario.service.js";

import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/usuario.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";

import horario_dia from "../entity/horario_dia.entity.js";
import usuarios from "../entity/usuario.entity.js";

export async function find(req, res) {
  console.log("find function: \n");
  const usuarioRepository = AppDataSource.getRepository(usuarios);
  const Usuarios = await usuarioRepository.find({
    relations: {
      horario_laboral: true,
    },
  });
  console.log(Usuarios);
  handleSuccess(res, 200, "Usuario encontrado", Usuarios);
  return;
}

// Obtener todos los usuarios
export async function getUsers(req, res) {
  try {
    const [users, error] = await getUsersService();
    if (error) return handleErrorClient(res, 404, error);
    
    handleSuccess(res, 200, "Usuarios obtenidos exitosamente", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener un usuario específico
export async function getUser(req, res) {
  try {
    const { id } = req.params;
    const [user, error] = await getUserService({ id_usuario: id });
    if (error) return handleErrorClient(res, 404, error);
    
    handleSuccess(res, 200, "Usuario obtenido exitosamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un usuario
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;
    const [updatedUser, error] = await updateUserService({ id_usuario: id }, body);
    if (error) return handleErrorClient(res, 400, error);
    
    handleSuccess(res, 200, "Usuario actualizado exitosamente", updatedUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un usuario
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const [deletedUser, error] = await deleteUserService({ id_usuario: id });
    if (error) return handleErrorClient(res, 400, error);
    
    handleSuccess(res, 200, "Usuario eliminado exitosamente", deletedUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
