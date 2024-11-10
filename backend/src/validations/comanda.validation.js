// backend/src/validations/comanda.validation.js
import Joi from 'joi';

// Validación para crear una nueva Comanda
export const createComandaValidation = Joi.object({
  id_usuario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
      "any.required": "El ID del usuario es obligatorio."
    }),
  estado_comanda: Joi.string()
    .valid("pendiente", "completada")
    .default("pendiente")
    .messages({
      "any.only": "El estado debe ser 'pendiente' o 'completada'."
    }),
  fecha_compra_comanda: Joi.date().iso().messages({
    "date.base": "La fecha debe ser una fecha válida en formato ISO.",
    "date.iso": "La fecha debe estar en formato ISO."
  }),
  hora_compra_comanda: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .messages({
      "string.pattern.base": "La hora debe estar en el formato HH:MM."
    })
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales."
  });

// Validación para agregar un platillo a una Comanda existente
export const addPlatilloToComandaValidation = Joi.object({
  id_platillo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del platillo debe ser un número.",
      "number.integer": "El ID del platillo debe ser un número entero.",
      "number.positive": "El ID del platillo debe ser un número positivo.",
      "any.required": "El ID del platillo es obligatorio."
    }),
  estado: Joi.string()
    .valid("pendiente", "preparando", "completado")
    .default("pendiente")
    .messages({
      "any.only": "El estado debe ser 'pendiente', 'preparando' o 'completado'."
    })
});

// Validación para actualizar una Comanda
export const updateComandaValidation = Joi.object({
  estado_comanda: Joi.string()
    .valid("pendiente", "completada")
    .optional()
    .messages({
      "any.only": "El estado debe ser 'pendiente' o 'completada'."
    }),
  fecha_compra_comanda: Joi.date().iso().messages({
    "date.base": "La fecha debe ser una fecha válida en formato ISO.",
    "date.iso": "La fecha debe estar en formato ISO."
  }),
  hora_compra_comanda: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .messages({
      "string.pattern.base": "La hora debe estar en el formato HH:MM."
    })
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales."
  });
