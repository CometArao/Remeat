"use strict";
import Joi from "joi";

const dateValidator = (value, helper) => {
  const fechaActual = new Date();
  const fechaIngresada = new Date(value);

  // Ajustar la fecha actual restando 3 horas (diferencia horaria del servidor)
  fechaActual.setHours(fechaActual.getHours() - 3);
  fechaActual.setHours(0, 0, 0, 0); // Ajuste para considerar solo la fecha
  fechaIngresada.setHours(0, 0, 0, 0);

  if (fechaIngresada < fechaActual) {
    return helper.message("La fecha debe ser posterior o igual a la fecha actual.");
  }
  return value;
};


// Validación para el cuerpo de las solicitudes de menú 
export const menuBodyValidation = Joi.object({
  fecha: Joi.date()
    .iso()
    .custom(dateValidator, "Validación de fecha")
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.iso": "La fecha debe estar en formato ISO 8601.",
    }),
  disponibilidad: Joi.boolean().messages({
    "boolean.base": "El campo 'disponibilidad' debe ser un valor booleano.",
  }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
    }),
  platillos: Joi.array()
    .items(
      Joi.object({
        id_platillo: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            "number.base": "El ID del platillo debe ser un número.",
            "number.integer": "El ID del platillo debe ser un número entero.",
            "number.positive": "El ID del platillo debe ser un número positivo.",
            "any.required": "El campo 'id_platillo' es obligatorio.",
          }),
      })
    )
    .messages({
      "array.base": "El campo 'platillos' debe ser un arreglo.",
    }),
  platilloIds: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "Cada 'id_platillo' debe ser un número.",
          "number.integer": "Cada 'id_platillo' debe ser un número entero.",
          "number.positive": "Cada 'id_platillo' debe ser un número positivo.",
        })
    )
    .messages({
      "array.base": "El campo 'platilloIds' debe ser un arreglo de IDs de platillos.",
    }),
})
  .or("fecha", "disponibilidad", "id_usuario", "platillos", "platilloIds")
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "Debes proporcionar al menos un campo en el cuerpo de la solicitud.",
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Validación para las consultas de menú (por query params)
export const menuQueryValidation = Joi.object({
  id_menu: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del menú debe ser un número.",
      "number.integer": "El ID del menú debe ser un número entero.",
      "number.positive": "El ID del menú debe ser un número positivo.",
    }),
  });