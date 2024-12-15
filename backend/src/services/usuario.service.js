"use strict";
import User from "../entity/usuario.entity.js";
import Horario_laboral from "../entity/horario_laboral.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { addTokenToBlacklist } from "../utils/tokenBlacklist.js";


// Crear un nuevo usuario
export async function createUserService(data) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Comprobar si el correo ya existe
        const existingUser = await userRepository.findOne({
            where: { correo_usuario: data.correo_usuario },
        });

        if (existingUser) return [null,"Ya existe un usuario con ese correo electrónico"];

        if (!data.contrasena_usuario || data.contrasena_usuario.trim() === "") {
            return [null, "La contraseña es obligatoria"];
        }
        data.contrasena_usuario = await encryptPassword(data.contrasena_usuario);

        const newUser = userRepository.create(data); // Crea una nueva instancia del usuario
        await userRepository.save(newUser); // Guarda el nuevo usuario en la base de datos

        return [newUser,null];
    } catch (error) {
         console.error("Error al crear el usuario:", error);
         return [null,"Error interno del servidor"];
     }
}

// Obtener un usuario específico por ID
export async function getUserService(query) {
    try {
       const { id_usuario } = query;

       const userRepository = AppDataSource.getRepository(User);

       const userFound = await userRepository.findOne({
           where: { id_usuario },
           relations: ["horario_laboral"],
       });

       if (!userFound) return [null,"Usuario no encontrado"];

       // Excluye la contraseña en el retorno
       const { contrasena_usuario,...userData } = userFound;

       return [userData,null];
   } catch (error) {
       console.error("Error al obtener el usuario:", error);
       return [null,"Error interno del servidor"];
   }
}

// Obtener todos los usuarios
export async function getUsersService() {
    try {
       const userRepository = AppDataSource.getRepository(User);

       const users = await userRepository.find({
           relations: ["horario_laboral"],
       });

       if (!users || users.length === 0) return [null,"No hay usuarios"];

       // Excluir contraseñas en los datos retornados
       const usersData = users.map(({ contrasena_usuario,...user }) => user);

       return [usersData,null];
   } catch (error) {
       console.error("Error al obtener a los usuarios:", error);
       return [null,"Error interno del servidor"];
   }
}

export async function updateUserService(query, body, user) {
    try {
        const { id_usuario } = query;

        // Comprobar si el usuario autenticado está modificando sus propios datos
        const isSelfUpdate =
            user.id_usuario === id_usuario &&
            (
                (body.correo_usuario && body.correo_usuario !== user.correo_usuario) || 
                (body.rol_usuario && body.rol_usuario !== user.rol_usuario)
            );

        if (isSelfUpdate) {
            console.log("Invalidando token para usuario:", user.id_usuario);
            addTokenToBlacklist(user.token); // Invalida el token actual
        }

        const userRepository = AppDataSource.getRepository(User);
        const horarioLaboralRepository = AppDataSource.getRepository(Horario_laboral);

        // Buscar el usuario por ID
        const userFound = await userRepository.findOne({
            where: { id_usuario },
            relations: ["horario_laboral"],
        });

        if (!userFound) return [null, "Usuario no encontrado"];

        // Validar si el correo ya existe
        if (body.correo_usuario) {
            const existingUser = await userRepository.findOne({
                where: { correo_usuario: body.correo_usuario },
            });

            if (existingUser && existingUser.id_usuario !== userFound.id_usuario) {
                return [null, "Ya existe un usuario con el mismo correo electrónico"];
            }
        }

        // Actualizar el horario laboral si se proporciona un ID
        if (body.id_horario_laboral) {
            const horarioLaboral = await horarioLaboralRepository.findOne({
                where: { id_horario_laboral: body.id_horario_laboral },
            });

            if (!horarioLaboral) {
                return [null, "El horario laboral especificado no existe."];
            }

            userFound.horario_laboral = horarioLaboral;
        }

        // Actualizar los demás campos
        Object.assign(userFound, {
            nombre_usuario: body.nombre_usuario,
            apellido_usuario: body.apellido_usuario,
            correo_usuario: body.correo_usuario,
            rol_usuario: body.rol_usuario,
        });

        // Comparar y actualizar la contraseña si se proporciona una nueva
        if (body.newPassword && body.newPassword.trim() !== "") {
            userFound.contrasena_usuario = await encryptPassword(body.newPassword);
        }

        // Guardar cambios si hay actualizaciones
        await userRepository.save(userFound);

        // Excluir la contraseña del objeto retornado
        const { contrasena_usuario, ...userUpdated } = userFound;

        return [userUpdated, null];
    } catch (error) {
        console.error("Error al modificar un usuario:", error);
        return [null, "Error interno del servidor"];
    }
}





export async function updateUserPasswordService(query, newPassword) {
    try {
        const { id_usuario } = query;
        const userRepository = AppDataSource.getRepository(User);

        const userFound = await userRepository.findOne({
            where: { id_usuario },
        });

        if (!userFound) return [null, "Usuario no encontrado"];

        // Actualizar la contraseña
        userFound.contrasena_usuario = await encryptPassword(newPassword);
        await userRepository.save(userFound);

        return [userFound, null];
    } catch (error) {
        console.error("Error al actualizar contraseña del usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

// Eliminar un usuario
export async function deleteUserService(query) {
   try {
      const { id_usuario } = query;

      const userRepository = AppDataSource.getRepository(User);

      const userFound = await userRepository.findOne({
          where: { id_usuario },
      });

      if (!userFound) return [null,"Usuario no encontrado"];

      if (userFound.rol_usuario === "administrador") {
          return [null,"No se puede eliminar un usuario con rol de administrador"];
      }

      await userRepository.remove(userFound); // Elimina el usuario

      // Excluir la contraseña en el retorno
      const { contrasena_usuario,...dataUser } = userFound;

      return [dataUser,null];
   } catch (error) {
       console.error("Error al eliminar un usuario:", error);
       return [null,"Error interno del servidor"];
   }
}