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
    //fecha: Joi.date()
    //.required()
    //.message({
        //'date.base': 'La fecha debe ser un valor de tipo fecha.',
        //'date.empty': 'La fecha no puede estar vacía.',

    //}),
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