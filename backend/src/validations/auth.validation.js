"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.com")) {
    return helper.message(
      "El correo electrónico debe finalizar en @gmail.com."
    );
  }
  return value;
};

export const authValidation = Joi.object({
  correo_usuario: Joi.string()
    .min(15)
    .max(35)
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El correo electrónico debe finalizar en @gmail.com.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
    contrasena_usuario: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

export const registerValidation = Joi.object({
  nombre_usuario: Joi.string()
    .min(4)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "any.required": "El nombre es obligatorio.",
      "string.base": "El nombre debe ser de tipo texto.",
      "string.min": "El nombre debe tener al menos 15 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
    
  apellido_usuario: Joi.string()
    .min(5)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El apellido no puede estar vacío.",
      "any.required": "El apellido es obligatorio.",
      "string.base": "El apellido debe ser de tipo texto.",
      "string.min": "El apellido debe tener al menos 15 caracteres.",
      "string.max": "El apellido debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El apellido solo puede contener letras y espacios.",
    }),

  correo_usuario: Joi.string()
    .min(15)
    .max(100)
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El correo electrónico debe finalizar en @gmail.com.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),

  contrasena_usuario: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatorio.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),

  rol_usuario: Joi.string()
    .valid("administrador", "cocinero", "mesero")
    .required()
    .messages({
      "string.base": "El rol debe ser de tipo string.",
      "any.only": "El rol debe ser uno de los siguientes: administrador, cocinero o mesero.",
      "any.required": "El rol es obligatorio.",
    }),
  
    id_horario_laboral: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El id de horario laboral debe ser un número.",
      "number.integer": "El id de horario laboral debe ser un número entero.",
      "number.positive": "El id de horario laboral debe ser un número positivo.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });