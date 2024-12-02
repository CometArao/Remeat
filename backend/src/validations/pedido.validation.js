"use strict";
import Joi from "joi";

export const pedidoValidation = Joi.object({
    id_pedido: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El id debe ser un número.",
            "number.integer": "El id debe ser un número entero.",
            "number.positive": "El id debe ser un número positivo.",
        }),
    descripcion_pedido: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            "string.empty": "La descripción del pedido no puede estar vacía.",
            "string.base": "La descripción del pedido debe ser de tipo string.",
            "string.min": "La descripción del pedido debe tener como mínimo 1 carácter.",
            "string.max": "La descripción del pedido debe tener como máximo 255 caracteres.",
        }),
    fecha_compra_pedido: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de compra debe ser una fecha válida.",
            "any.required": "La fecha de compra es obligatoria."
        }),
    fecha_entrega_pedido: Joi.date()
        .greater(Joi.ref("fecha_compra_pedido")) // Asegura que la fecha de entrega sea posterior a la fecha de compra
        .required()
        .messages({
            "date.base": "La fecha de entrega debe ser una fecha válida.",
            "any.required": "La fecha de entrega es obligatoria.",
            "date.greater": "La fecha de entrega debe ser posterior a la fecha de compra."
        }),
    estado_pedido: Joi.string()
        .valid("pendiente", "enviado", "recibido")
        .required()
        .messages({
            "string.base": "El estado del pedido debe ser de tipo string.",
            "any.only": "El estado del pedido debe ser uno de: pendiente, enviado, recibido.",
            "any.required": "El estado del pedido es obligatorio."
        }),
    costo_pedido: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El costo debe ser un número.",
            "number.integer": "El costo debe ser un número entero.",
            "number.positive": "El costo debe ser un número positivo.",
            "any.required": "El costo del pedido es obligatorio."
        }),
    id_usuario: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El id de usuario debe ser un número.",
            "number.integer": "El id de usuario debe ser un número entero.",
            "number.positive": "El id de usuario debe ser un número positivo.",
            "any.required": "El id de usuario es obligatorio."
        }),
    id_proveedor: Joi.number() // Agregar validación para el ID del proveedor
        .integer()
        .positive()
        .required() // Este campo es obligatorio
        .messages({
            "number.base": "El id del proveedor debe ser un número.",
            "number.integer": "El id del proveedor debe ser un número entero.",
            "number.positive": "El id del proveedor debe ser un número positivo.",
            "any.required": "El id del proveedor es obligatorio."
        }),
    ingredientes: Joi.array() // Validación para ingredientes
        .items(Joi.number().integer().positive())
        .optional() // Este campo es opcional
        .messages({
            "array.base": "Los ingredientes deben ser un arreglo.",
            "array.includesRequiredUnknowns": "Algunos ingredientes no son válidos."
        }),
    utensilios: Joi.array() // Validación para utensilios
        .items(Joi.number().integer().positive())
        .optional() // Este campo es opcional
        .messages({
            "array.base": "Los utensilios deben ser un arreglo.",
            "array.includesRequiredUnknowns": "Algunos utensilios no son válidos."
        }),
});