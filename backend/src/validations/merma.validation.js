"use strict"
import Joi from "joi";

export const mermaValidation = Joi.object({
    id_merma: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  fecha: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.format": "La fecha debe estar en formato ISO 8601.",
    }),
    cantidad_perdida: Joi.number()
    .integer()
    .positive()
    .message({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    })
})
export const mermaQueryValidation = Joi.object({
    id_merma: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})