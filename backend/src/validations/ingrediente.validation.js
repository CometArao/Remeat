"use strict";
import Joi from "joi";

// validacion de fecha de vencimiento
const dateValidator = (value, helper) => {
    const fechaActual = new Date();
    const fechaIngresada = new Date(value);

    fechaActual.setHours(fechaActual.getHours() - 3); // Obtengo hora actual chilena

    // Ajustar la fecha actual restando 3 horas (diferencia horaria del servidor)
    fechaActual.setHours(-3, 0, 0, 0); // Ajuste para considerar solo la fecha

    //fechaIngresada.setHours(0, 0, 0, 0);

    if (fechaIngresada < fechaActual) {
        return helper.message("La fecha de vencimiento debe ser posterior o igual a la fecha actual.");
    }
    return value;
}
// Validación para el cuerpo de las solicitudes de ingrediente

export const ingredienteBodyValidation = Joi.object({


    fecha_vencimiento: Joi.date()
        .iso()
        .custom(dateValidator, "Validación de fecha")
        .messages({
            "date.base": "La fecha de vencimiento debe ser una fecha válida.",
            "date.iso": "La fecha de vencimiento debe estar en formato ISO 8601.",
        }),
    cantidad_ingrediente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "La cantidad de ingrediente debe ser un número.",
            "number.integer": "La cantidad de ingrediente debe ser un número entero.",
            "number.positive": "La cantidad de ingrediente debe ser un número positivo.",
            "any.required": "El campo 'cantidad_ingrediente' es obligatorio.",
        }),
    cantidad_original_ingrediente: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "La cantidad original de ingrediente debe ser un número.",
            "number.integer": "La cantidad original de ingrediente debe ser un número entero.",
            "number.positive": "La cantidad original de ingrediente debe ser un número positivo.",
        }),
    costo_ingrediente: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El costo de ingrediente debe ser un número.",
            "number.integer": "El costo de ingrediente debe ser un número entero.",
            "number.positive": "El costo de ingrediente debe ser un número positivo.",
        }),
    id_tipo_ingrediente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del tipo de ingrediente debe ser un número.",
            "number.integer": "El ID del tipo de ingrediente debe ser un número entero.",
            "number.positive": "El ID del tipo de ingrediente debe ser un número positivo.",
            "any.required": "El campo 'id_tipo_ingrediente' es obligatorio.",
        }),
    id_pedido: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
            "number.base": "El ID del pedido debe ser un número.",
            "number.integer": "El ID del pedido debe ser un número entero.",
            "number.positive": "El ID del pedido debe ser un número positivo.",
        }),
})

// validación para el parámetro de las solicitudes de ingrediente
export const ingredienteQueryValidation = Joi.object({
    id_ingrediente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del ingrediente debe ser un número.",
            "number.integer": "El ID del ingrediente debe ser un número entero.",
            "number.positive": "El ID del ingrediente debe ser un número positivo.",
            "any.required": "El campo 'id_ingrediente' es obligatorio.",
        }),
})

// validacion para el cuerpo de tipo de ingrediente
export const tipoIngredienteBodyValidation = Joi.object({
    nombre_tipo_ingrediente: Joi.string()
        .min(3)
        .max(50)
        .required()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.base": "El nombre del tipo de ingrediente debe ser una cadena de texto.",
            "string.min": "El nombre del tipo de ingrediente debe tener al menos {#limit} caracteres.",
            "string.max": "El nombre del tipo de ingrediente no debe tener más de {#limit} caracteres.",
            "any.required": "El campo 'nombre_tipo_ingrediente' es obligatorio.",
            "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
        }),
})

// validacion para la consulta de tipo de ingrediente
export const tipoIngredienteQueryValidation = Joi.object({
    id_tipo_ingrediente: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del tipo de ingrediente debe ser un número.",
            "number.integer": "El ID del tipo de ingrediente debe ser un número entero.",
            "number.positive": "El ID del tipo de ingrediente debe ser un número positivo.",
            "any.required": "El campo 'id_tipo_ingrediente' es obligatorio.",
        }),
})