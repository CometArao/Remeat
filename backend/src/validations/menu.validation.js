"use strict";
import Joi from "joi";

// Función personalizada para validar que la fecha no sea anterior a la actual
const dateValidator = (value, helper) => {
  const fechaActual = new Date();
  const fechaIngresada = new Date(value);

  // Ajuste para considerar solo la fecha sin la hora
  fechaActual.setHours(0, 0, 0, 0);
  fechaIngresada.setHours(0, 0, 0, 0);

  if (fechaIngresada < fechaActual) {
    return helper.message("La fecha debe ser posterior o igual a la fecha actual.");
  }
  return value;
};

// Validación para consultas de menú (por query params)
export const menuQueryValidation = Joi.object({
  id_menu: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del menú debe ser un número.",
      "number.integer": "El ID del menú debe ser un número entero.",
      "number.positive": "El ID del menú debe ser un número positivo.",
    }),
  fecha: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.format": "La fecha debe estar en formato ISO 8601.",
    }),
})
  .or("id_menu", "fecha")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id_menu o fecha.",
  });

// Validación para el cuerpo de las solicitudes de menú (body)
export const menuBodyValidation = Joi.object({
  fecha: Joi.date()
    .iso()
    .required()
    .custom(dateValidator, "Validación de fecha")
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.iso": "La fecha debe estar en formato ISO 8601.",
      "any.required": "El campo 'fecha' es obligatorio.",
    }),
  disponibilidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La disponibilidad debe ser un número.",
      "number.integer": "La disponibilidad debe ser un número entero.",
      "number.positive": "La disponibilidad debe ser un número positivo.",
      "any.required": "El campo 'disponibilidad' es obligatorio.",
    }),
  platilloIds: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "El ID del platillo debe ser un número.",
          "number.integer": "El ID del platillo debe ser un número entero.",
          "number.positive": "El ID del platillo debe ser un número positivo.",
        })
    )
    .messages({
      "array.base": "platilloIds debe ser un arreglo de números.",
    }),
  usuarioIds: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "El ID del usuario debe ser un número.",
          "number.integer": "El ID del usuario debe ser un número entero.",
          "number.positive": "El ID del usuario debe ser un número positivo.",
        })
    )
    .messages({
      "array.base": "usuarioIds debe ser un arreglo de números.",
    }),
})
  .or("fecha", "disponibilidad", "platilloIds", "usuarioIds") // Al menos uno de los campos es obligatorio
  .unknown(false)
  .messages({
    //"object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un campo: fecha, disponibilidad, platilloIds o usuarioIds.",
  });
