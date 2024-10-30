"use strict";
import Joi from "joi";

export const tipo_utensilioValidation = Joi.object({
    id_tipo_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
    nombre_tipo_utensilio: Joi.string()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .min(1)
        .max(50)
        .message({
            "string.empty": "El nombre del tipo utensilio no puede estar vacío.",
            "string.base": "El nombre del tipo utensilio debe ser de tipo string.",
            "string.min":
                "El nombre del tipo utensiliodebe tener como mínimo 1 caracteres.",
            "string.max":
                "El nombre del tipo utensilio debe tener como máximo 50 caracteres.",
        })
})
export const tipo_utensilioQueryValidation = Joi.object({
    id_tipo_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})
export const utensilioValidation = Joi.object({
    id_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
    cantidad_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.positive": "La cantidad debe ser un número positivo.",
    }),
    id_tipo_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})
export const utensilioQueryValidation = Joi.object({
    id_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})