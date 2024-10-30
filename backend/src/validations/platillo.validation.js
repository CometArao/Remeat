"use strict";
import Joi from "joi";

// Validación para el cuerpo de las solicitudes de platillo (body)
export const platilloBodyValidation = Joi.object({
  nombre_platillo: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre del platillo debe ser una cadena de texto.",
      "string.max": "El nombre del platillo no debe exceder los 255 caracteres.",
      "any.required": "El campo 'nombre_platillo' es obligatorio.",
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
      "any.allowOnly": "El ID del usuario puede ser un número o null.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const platilloPrecioValidation = Joi.object({
  precio_platillo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El precio del platillo debe ser un número.",
      "number.integer": "El precio del platillo debe ser un número entero.",
      "number.positive": "El precio del platillo debe ser un número positivo.",
      "any.required": "El campo 'precio_platillo' es obligatorio.",
    }),
});
