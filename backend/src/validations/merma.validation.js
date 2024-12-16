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
  utensilios: Joi.array().required()
  .items(
    Joi.object({
      id_utensilio: Joi.number().required()
      .integer()
      .positive()
      .message({
        "numer.base": "utensilios debe contener las ids de tipos de utensilio",
        "number.integer": "utensilios solo puede contener enteros",
        "number.positive": "utensilios solo puede contener numeros positivos"
      }),
      cantidad_perdida: Joi.number().required()
      .integer()
      .positive()
      .message({
        "numer.base": "utensilios debe contener las ids de tipos de utensilio",
        "number.integer": "utensilios solo puede contener enteros",
        "number.positive": "utensilios solo puede contener numeros positivos"
      })
    })
  ),
  ingredientes: Joi.array().required()
  .items(
    Joi.object({
      id_ingrediente: Joi.number().required()
      .integer()
      .positive()
      .message({
        "numer.base": "utensilios debe contener las ids de tipos de utensilio",
        "number.integer": "utensilios solo puede contener enteros",
        "number.positive": "utensilios solo puede contener numeros positivos"
      }),
      cantidad_perdida: Joi.number().required()
      .integer()
      .positive()
      .message({
        "numer.base": "utensilios debe contener las ids de tipos de utensilio",
        "number.integer": "utensilios solo puede contener enteros",
        "number.positive": "utensilios solo puede contener numeros positivos"
      })
    })
  ),
})
export const mermaQueryValidation = Joi.object({
  id_merma: Joi.number().required()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})