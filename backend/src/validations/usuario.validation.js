"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.com")) {
    return helper.message(
      "El correo electrónico debe ser del dominio @gmail.com"
    );
  }
  return value;
};

export const userQueryValidation = Joi.object({
  id_usuario: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  correo_usuario: Joi.string()
    .min(15)
    .max(35)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.com.",
      "string.min":
        "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
})
  .or("id_usuario", "correo_usuario")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id, email o rut.",
  });

export const userBodyValidation = Joi.object({
  nombre_usuario: Joi.string()
    .min(15)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 15 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
      "string.pattern.base":
      // TODO - Cambiar porque solo se debe almacenar un nombre a la vez
        "El nombre solo puede contener letras y espacios.",
    }),
  apellido_usuario: Joi.string()
    .min(15)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 15 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
      "string.pattern.base":
      // TODO - Cambiar porque solo se debe almacenar un nombre a la vez
        "El nombre solo puede contener letras y espacios.",
    }),
  correo_usuario: Joi.string()
    .min(15)
    .max(35)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.com.",
      "string.min":
        "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  contrasena_usuario: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base":
        "La contraseña solo puede contener letras y números.",
    }),
  contrasena_nueva_usuario: Joi.string()
    .min(8)
    .max(26)
    .allow("")
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La nueva contraseña no puede estar vacía.",
      "string.base": "La nueva contraseña debe ser de tipo string.",
      "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base":
        "La nueva contraseña solo puede contener letras y números.",
    }),
  rol_usuario: Joi.string()
    .min(4)
    .max(15)
    .messages({
      "string.base": "El rol debe ser de tipo string.",
      "string.min": "El rol debe tener como mínimo 4 caracteres.",
      "string.max": "El rol debe tener como máximo 15 caracteres.",
    }),
})
  .or(
    "nombre_usuario",
    "apellido_usuario",
    "correo_usuario",
    "contrasena_usuario",
    "contrasena_nueva_usuario",
    "rol_usuario",
  )
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un campo: nombreCompleto, email, password, newPassword, rut o rol.",
  });
