"use strict";
import {
    createUserService,
    deleteUserService,
    getUserService,
    getUsersService,
    updateUserPasswordService,
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
import User from "../entity/usuario.entity.js"; // Importa la entidad Usuario

// Crear un nuevo usuario
export async function createUser(req, res) {
    try {
        const { error } = userBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        //req.body.id_horario_laboral = parseInt(req.body.id_horario_laboral, 10);
        const [newUser, serviceError] = await createUserService(req.body);
        if (serviceError) {
            return handleErrorClient(res, 400, serviceError);
        }

        // Preparar la respuesta excluyendo la contraseña
        const { contrasena_usuario, ...userData } = newUser;

        handleSuccess(res, 201, "Usuario creado exitosamente", userData);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
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
        const body = { ...req.body };

        // Extraer el token del encabezado de autorización
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return handleErrorClient(res, 401, "No se proporcionó el token de autenticación.");
        }

        // Agregar el token y el usuario autenticado al cuerpo
        body.token = token;

        // Validar solo los campos permitidos
        const { errorValidation } = userBodyValidation.validate(body);
        if (errorValidation) {
            return handleErrorClient(res, 400, errorValidation.details[0].message);
        }

        const [updatedUser, errorUpdateUser] = await updateUserService(
            { id_usuario: id },
            body,
            req.user // Usuario autenticado
        );

        if (errorUpdateUser) {
            return handleErrorClient(res, 400, errorUpdateUser);
        }

        // Preparar la respuesta excluyendo la contraseña
        const { contrasena_usuario, ...userUpdatedData } = updatedUser;

        handleSuccess(res, 200, "Usuario actualizado exitosamente", userUpdatedData);

        // Si el token fue invalidado, devolver una respuesta especial
        if (req.user.id_usuario === id && (body.correo_usuario || body.rol_usuario)) {
            res.setHeader("Token-Invalidated", "true");
        }
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



export async function updateUserPassword(req, res) {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (req.user.rol_usuario !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permisos para cambiar la contraseña de un usuario.");
        }

        const [updatedUser, error] = await updateUserPasswordService({ id_usuario: id }, newPassword);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        // Excluir contraseña de la respuesta
        const { contrasena_usuario, ...userWithoutPass } = updatedUser;

        handleSuccess(res, 200, "Contraseña actualizada exitosamente", userWithoutPass);
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
        
        handleSuccess(res, 200,"Usuario eliminado exitosamente", deletedUser);
    } catch (error) {
       handleErrorServer(res ,500 ,error.message );
   }
}