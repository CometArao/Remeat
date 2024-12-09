// backend/src/validations/comanda.validation.js
import Joi from 'joi';





export const createComandaValidation = Joi.object({
  id_usuario: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
      "any.required": "El ID del usuario es obligatorio."
    }),
  email: Joi.string()
    .email()
    .when("id_usuario", {
      is: Joi.exist(),
      then: Joi.forbidden(),
      otherwise: Joi.required()
    })
    .messages({
      "string.email": "El correo debe ser válido.",
      "any.required": "El correo del usuario es obligatorio si no se proporciona el ID.",
      "any.unknown": "No se permite el correo si ya se envió un ID."
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
  .xor("id_usuario", "email") // Obligatorio enviar solo una forma de identificar al usuario
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales."
  });




  // Validación para agregar un platillo a una Comanda existente
export const addPlatilloToComandaValidation = Joi.object({
  nombre_platillo: Joi.string()
    .required()
    .messages({
      "string.base": "El nombre del platillo debe ser una cadena de texto.",
      "any.required": "El nombre del platillo es obligatorio."
    }),
  estado: Joi.string()
    .valid("pendiente", "preparado", "entregado")
    .default("pendiente")
    .messages({
      "any.only": "El estado debe ser 'pendiente', 'preparado' o 'entregado'."
    }),
  cantidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.positive": "La cantidad debe ser un número positivo.",
      "any.required": "La cantidad es obligatoria."
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
