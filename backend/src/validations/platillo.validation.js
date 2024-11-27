// platillo.validation.js
"use strict";
import Joi from "joi";

// Validación para el cuerpo de las solicitudes de platillo (body)
export const platilloBodyValidation = Joi.object({
  nombre_platillo: Joi.string()
    .max(100)
    .messages({
      "string.base": "El campo 'nombre_platillo' debe ser una cadena de texto.",
      "string.max": "El campo 'nombre_platillo' no debe exceder los 100 caracteres.",
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El campo 'id_usuario' debe ser un número.",
      "number.integer": "El campo 'id_usuario' debe ser un número entero.",
      "number.positive": "El campo 'id_usuario' debe ser un número positivo.",
    }),
  ingredientes: Joi.array()
    .items(
      Joi.object({
        id_tipo_ingrediente: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            "number.base": "El campo 'id_tipo_ingrediente' debe ser un número.",
            "number.integer": "El campo 'id_tipo_ingrediente' debe ser un número entero.",
            "number.positive": "El campo 'id_tipo_ingrediente' debe ser un número positivo.",
            "any.required": "El campo 'id_tipo_ingrediente' es obligatorio.",
          }),
        porcion_ingrediente_platillo: Joi.number()
          .positive()
          .required()
          .messages({
            "number.base": "El campo 'porcion_ingrediente_platillo' debe ser un número.",
            "number.positive": "El campo 'porcion_ingrediente_platillo' debe ser un número positivo.",
            "any.required": "El campo 'porcion_ingrediente_platillo' es obligatorio.",
          }),
      })
    )
    .messages({
      "array.base": "El campo 'ingredientes' debe ser un arreglo.",
    }),
})
  .or("nombre_platillo", "precio_platillo", "disponible", "id_usuario", "ingredientes")
  .min(1)
  .messages({
    "object.min": "Debes proporcionar al menos un campo en el cuerpo de la solicitud.",
  });

// Validación para las consultas de platillo (por query params)
export const platilloQueryValidation = Joi.object({
  id_platillo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El 'id_platillo' debe ser un número.",
      "number.integer": "El 'id_platillo' debe ser un número entero.",
      "number.positive": "El 'id_platillo' debe ser un número positivo.",
      "any.required": "El 'id_platillo' es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales en los parámetros de consulta.",
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
