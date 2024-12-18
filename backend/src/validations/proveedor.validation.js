"use strict";
import Joi from "joi";

// Validación para el cuerpo del proveedor
export const proveedorBodyValidation = Joi.object({
    tipo_proveedor: Joi.string()
        .min(1)
        .max(255)
        .required()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.empty": "El tipo de proveedor no puede estar vacío.",
            "string.base": "El tipo de proveedor debe ser de tipo string.",
            "string.min": "El tipo de proveedor debe tener como mínimo 1 carácter.",
            "string.max": "El tipo de proveedor debe tener como máximo 255 caracteres.",
            "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
        }),
    nombre_proveedor: Joi.string()
        .min(1)
        .max(255)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El nombre del proveedor no puede estar vacío.",
            "string.base": "El nombre del proveedor debe ser de tipo string.",
            "string.min": "El nombre del proveedor debe tener como mínimo 1 carácter.",
            "string.max": "El nombre del proveedor debe tener como máximo 255 caracteres.",
            "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
        }),
    correo_proveedor: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe ser válido."
        }),
});

// Validación para las consultas del proveedor
export const proveedorQueryValidation = Joi.object({
    id_proveedor: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El ID debe ser un número.",
            "number.integer": "El ID debe ser un número entero.",
            "number.positive": "El ID debe ser un número positivo.",
        }),
    correo_proveedor: Joi.string()
        .email()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe ser válido."
        })
})
    .or("id_proveedor", "correo_proveedor") // Debe proporcionar al menos uno
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": 
          "Debes proporcionar al menos un parámetro: id_proveedor o correo_proveedor."
    });