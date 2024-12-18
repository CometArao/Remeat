"use strict";

import Joi from "joi";

// Validación para el cuerpo de las solicitudes de medida
export const medidaBodyValidation = Joi.object({
  nombre_unidad_medida: Joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/)
    .messages({
      "string.base": "El nombre debe ser una cadena de texto.",
      "string.min": "El nombre debe tener al menos {#limit} caracteres.",
      "string.max": "El nombre debe tener como máximo {#limit} caracteres.",
      "any.required": "El campo 'nombre' es obligatorio.",
      "string.pattern.base":
                 "El nombre solo puede contener letras y un único espacio entre palabras.",
    }),
});

// Validación para las consultas de medidas
export const medidaQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la medida debe ser un número.",
      "number.integer": "El ID de la medida debe ser un número entero.",
      "number.positive": "El ID de la medida debe ser un número positivo.",
      "any.required": "El campo 'id' es obligatorio.",
    }),
});