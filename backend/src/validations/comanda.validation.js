import Joi from 'joi';

// Validación para crear una Comanda
export const createComandaValidation = Joi.object({
  platillo: Joi.object({
    nombre_platillo: Joi.string()
      .required()
      .messages({
        "string.base": "El nombre del platillo debe ser una cadena de texto.",
        "any.required": "El nombre del platillo es obligatorio."
      }),
    cantidad: Joi.number()
      .integer()
      .positive()
      .max(10)
      .required()
      .messages({
        "number.base": "La cantidad debe ser un número.",
        "number.integer": "La cantidad debe ser un número entero.",
        "number.positive": "La cantidad debe ser un número positivo.",
        "number.max": "No se pueden añadir más de 10 unidades en una sola solicitud.",
        "any.required": "La cantidad es obligatoria."
      }),
    estado: Joi.string()
      .valid("pendiente", "preparado", "entregado")
      .default("pendiente")
      .messages({
        "any.only": "El estado del platillo debe ser 'pendiente', 'preparado' o 'entregado'."
      })
  })
    .required()
    .messages({
      "any.required": "La información del platillo es obligatoria."
    }),

    estado_comanda: Joi.string()
    .valid("pendiente", "completada")
    .default("pendiente")
    .messages({
      "any.only": "El estado de la comanda debe ser 'pendiente' o 'completada'."
    })


});

// Validación para añadir un platillo a una Comanda existente
export const addPlatilloToComandaValidation = Joi.object({
  nombre_platillo: Joi.string()
    .required()
    .messages({
      "string.base": "El nombre del platillo debe ser una cadena de texto.",
      "any.required": "El nombre del platillo es obligatorio."
    }),
  cantidad: Joi.number()
    .integer()
    .positive()
    .max(10)
    .required()
    .messages({
      "number.base": "La cantidad debe ser un número.",
      "number.integer": "La cantidad debe ser un número entero.",
      "number.positive": "La cantidad debe ser un número positivo.",
      "number.max": "No se pueden añadir más de 10 unidades en una sola solicitud.",
      "any.required": "La cantidad es obligatoria."
    }),
  estado: Joi.string()
    .valid("pendiente", "preparado", "entregado")
    .default("pendiente")
    .messages({
      "any.only": "El estado del platillo debe ser 'pendiente', 'preparado' o 'entregado'."
    })
});

// Validación para eliminar una Comanda
export const deleteComandaValidation = Joi.object({
  estado_comanda: Joi.string()
    .valid("pendiente")
    .required()
    .messages({
      "any.only": "Solo se pueden eliminar comandas en estado 'pendiente'."
    })
});

// Validación para completar una Comanda
export const completeComandaValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la comanda debe ser un número.",
      "number.integer": "El ID de la comanda debe ser un número entero.",
      "number.positive": "El ID de la comanda debe ser un número positivo.",
      "any.required": "El ID de la comanda es obligatorio."
    })
});

// Validación para eliminar un platillo de una comanda
export const removePlatilloFromComandaValidation = Joi.object({
  id_comanda: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la comanda debe ser un número.",
      "number.integer": "El ID de la comanda debe ser un número entero.",
      "number.positive": "El ID de la comanda debe ser un número positivo.",
      "any.required": "El ID de la comanda es obligatorio."
    }),
  id_platillo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del platillo debe ser un número.",
      "number.integer": "El ID del platillo debe ser un número entero.",
      "number.positive": "El ID del platillo debe ser un número positivo.",
      "any.required": "El ID del platillo es obligatorio."
    })
});
