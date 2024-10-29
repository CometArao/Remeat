"use strict";
import User from "../entity/usuario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService(query) {
  try {
    const { id_usuario } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id_usuario },
      relations: ["horario_laboral"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    // Excluye la contraseña en el retorno
    const { contrasena_usuario, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      relations: ["horario_laboral"],
    });

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ contrasena_usuario, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id_usuario } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id_usuario },
      relations: ["horario_laboral"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    // Validar que el email o rol no están duplicados
    if (body.correo_usuario) {
      const existingUser = await userRepository.findOne({
        where: { correo_usuario: body.correo_usuario },
      });

      if (existingUser && existingUser.id_usuario !== userFound.id_usuario) {
        return [null, "Ya existe un usuario con el mismo correo electrónico"];
      }
    }

    // Comparar y actualizar la contraseña
    if (body.contrasena_usuario) {
      const isMatch = await comparePassword(
        body.contrasena_usuario,
        userFound.contrasena_usuario
      );

      if (!isMatch) return [null, "La contraseña actual no coincide"];
    }

    const dataUserUpdate = {
      nombre_usuario: body.nombre_usuario,
      apellido_usuario: body.apellido_usuario,
      correo_usuario: body.correo_usuario,
      rol_usuario: body.rol_usuario,
      id_horario_laboral: body.id_horario_laboral,
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.contrasena_usuario = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id_usuario: userFound.id_usuario }, dataUserUpdate);

    // Obtener usuario actualizado para retornar
    const userData = await userRepository.findOne({
      where: { id_usuario: userFound.id_usuario },
      relations: ["horario_laboral"],
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { contrasena_usuario, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id_usuario } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id_usuario },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol_usuario === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    await userRepository.remove(userFound);

    const { contrasena_usuario, ...dataUser } = userFound;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
