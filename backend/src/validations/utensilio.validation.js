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
            "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
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
    costo_utensilio: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El costo debe ser un numbero",
      "number.integer": "El costo debe ser un entero",
      "number.positive": "El costo debe ser positivo"
    })
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
export const utensilioEditValidation = Joi.object({
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
    .min(0)
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.min": "La cantidad restante debe ser mayor o igual a 0"
    }),
    cantidad_restante_utensilio: Joi.number()
    .integer()
    .min(0)
    .message({
      "number.base": "La cantidad restante debe ser un número",
      "number.integer": "La cantidad restante debe ser un numero entero",
      "number.min": "La cantidad restante debe ser mayor o igual a 0"
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