"use strict";
import User from "../entity/usuario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

// Crear un nuevo usuario
export async function createUserService(data) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Comprobar si el correo ya existe
        const existingUser = await userRepository.findOne({
            where: { correo_usuario: data.correo_usuario },
        });

        if (existingUser) return [null,"Ya existe un usuario con ese correo electrónico"];

        // Encriptar la contraseña antes de guardar
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

// Actualizar un usuario
export async function updateUserService(query, body) {
   try {
      const { id_usuario } = query;

      const userRepository = AppDataSource.getRepository(User);

      const userFound = await userRepository.findOne({
          where: { id_usuario },
          relations: ["horario_laboral"],
      });

      if (!userFound) return [null,"Usuario no encontrado"];

      // Validar que el email no esté duplicado
      if (body.correo_usuario) {
          const existingUser = await userRepository.findOne({
              where: { correo_usuario: body.correo_usuario },
          });

          if (existingUser && existingUser.id_usuario !== userFound.id_usuario) {
              return [null,"Ya existe un usuario con el mismo correo electrónico"];
          }
      }

      // Actualizar solo los campos permitidos
      Object.assign(userFound,{
          nombre_usuario: body.nombre_usuario,
          apellido_usuario: body.apellido_usuario,
          correo_usuario: body.correo_usuario,
          id_horario_laboral: body.id_horario_laboral,
      });

      // Comparar y actualizar la contraseña si se proporciona una nueva
      if (body.newPassword && body.newPassword.trim() !== "") {
          userFound.contrasena_usuario = await encryptPassword(body.newPassword);
      }

      await userRepository.save(userFound); // Guarda los cambios

      // Excluir la contraseña en el retorno
      const { contrasena_usuario,...userUpdated } = userFound;

      return [userUpdated,null];
   } catch (error) {
       console.error("Error al modificar un usuario:", error);
       return [null,"Error interno del servidor"];
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