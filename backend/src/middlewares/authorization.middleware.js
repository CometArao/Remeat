"use strict";
import User from "../entity/usuario.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { 
  getCurrentChileanTime, 
  truncateToMinutes 
} from "../utils/dateUtils.js";

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

export const verificarHorarioLaboral = async (req, res, next) => {
  try {
      // Obtener ID del usuario desde el token decodificado
      const idUsuario = req.user?.id_usuario;

      if (!idUsuario) {
          return res.status(400).json({
              status: "Error",
              message: "El ID del usuario es obligatorio para verificar el horario laboral.",
          });
      }

      const usuarioRepository = AppDataSource.getRepository(User);

      // Obtener el usuario con su horario laboral y días laborales
      const usuario = await usuarioRepository.findOne({
          where: { id_usuario: idUsuario },
          relations: ["horario_laboral", "horario_laboral.horario_dia"],
      });

      if (!usuario) {
          return res.status(404).json({
              status: "Error",
              message: "Usuario no encontrado.",
          });
      }

      if (!usuario.horario_laboral) {
          return res.status(400).json({
              status: "Error",
              message: "El usuario no tiene un horario laboral asignado.",
          });
      }

      // Función para normalizar textos (eliminar tildes y convertir a minúsculas)
      const normalizarTexto = (texto) => {
        return texto
          .normalize("NFD") // Normaliza los caracteres Unicode
          .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
          .toLowerCase(); // Convierte a minúsculas
      };

      // Obtener la hora actual en Chile utilizando `dateUtils`
      const fechaActual = truncateToMinutes(getCurrentChileanTime());
      console.log("Fecha actual en Chile:", fechaActual);

      // Extraer la hora y minutos directamente del objeto ISO
      const [isoDate, isoTime] = fechaActual.toISOString().split("T");
      const [isoHours, isoMinutes] = isoTime.split(":");

      const horaActual = `${isoHours}:${isoMinutes}:00`;

      // Obtener el día de la semana
      //const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
      const diaSemana = diasSemana[fechaActual.getDay()];
      console.log(diaSemana)
      const diaNormalizado = normalizarTexto(diaSemana);

      console.log("Hora actual (Chile):", horaActual);
      console.log("Día de la semana:", diaNormalizado);

      // Verificar el horario laboral del día correspondiente
      const horarioDia = usuario.horario_laboral.horario_dia.find(
          (horario) => normalizarTexto(horario.dia_semana) === diaNormalizado
      );

      if (!horarioDia) {
          return res.status(403).json({
              status: "Error",
              message: `No hay horario laboral configurado para el día: ${diaSemana}.`,
          });
      }

      console.log("Horario laboral encontrado:", horarioDia);

      // Verificar si la hora actual está dentro del horario laboral
      if (horaActual >= horarioDia.hora_inicio && horaActual <= horarioDia.hora_fin) {
          console.log("El usuario está dentro de su horario laboral.");
          return next(); // Permitir acceso si está dentro del horario laboral
      }

      return res.status(403).json({
        status: "Error",
        message: `Estás fuera de tu horario laboral (${horaActual} 
        fuera de ${horarioDia.hora_inicio} - ${horarioDia.hora_fin}).`,
      });
  } catch (error) {
      console.error("Error al verificar el horario laboral:", error.message);
      return res.status(500).json({
          status: "Error",
          message: "Hubo un problema al verificar el horario laboral.",
      });
  }
};
