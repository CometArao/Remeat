"use strict";
import Joi from "joi";
import { getCurrentChileanTimestamp } from "../utils/dateUtils.js";

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
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.empty": "La descripción del pedido no puede estar vacía.",
            "string.base": "La descripción del pedido debe ser de tipo string.",
            "string.min": "La descripción del pedido debe tener como mínimo 1 carácter.",
            "string.max": "La descripción del pedido debe tener como máximo 255 caracteres.",
            "string.pattern.base":
                 "El nombre solo puede contener letras y espacios.",
        }),
    fecha_compra_pedido: Joi.date()
        .required()
        .messages({
            "date.base": "La fecha de compra debe ser una fecha válida.",
            "any.required": "La fecha de compra es obligatoria.",
        }),
    fecha_entrega_pedido: Joi.date()
        .min(getCurrentChileanTimestamp()) // Validar que sea posterior a la hora actual
        .required()
        .messages({
            "date.base": "La fecha de entrega debe ser una fecha válida.",
            "any.required": "La fecha de entrega es obligatoria.",
            "date.min": "La fecha de entrega debe ser posterior a la fecha y hora actual.",
        }),
    estado_pedido: Joi.string()
        .valid("Pendiente", "Ingresado")
        .messages({
            "string.base": "El estado del pedido debe ser de tipo string.",
            "any.only": "El estado del pedido debe ser uno de: Pendiente, Ingresado.",
            "any.required": "El estado del pedido es obligatorio.",
        }),
    costo_pedido: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El costo debe ser un número.",
            "number.integer": "El costo debe ser un número entero.",
            "number.positive": "El costo debe ser un número positivo.",
            "any.required": "El costo del pedido es obligatorio.",
        }),
    id_usuario: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El id de usuario debe ser un número.",
            "number.integer": "El id de usuario debe ser un número entero.",
            "number.positive": "El id de usuario debe ser un número positivo.",
            "any.required": "El id de usuario es obligatorio.",
        }),
    id_proveedor: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El id del proveedor debe ser un número.",
            "number.integer": "El id del proveedor debe ser un número entero.",
            "number.positive": "El id del proveedor debe ser un número positivo.",
            "any.required": "El id del proveedor es obligatorio.",
        }),
    ingredientes: Joi.array()
        .items(
            Joi.object({
                id_ingrediente: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "El id del ingrediente debe ser un número.",
                        "number.integer": "El id del ingrediente debe ser un número entero.",
                        "number.positive": "El id del ingrediente debe ser un número positivo.",
                        "any.required": "El id del ingrediente es obligatorio.",
                    }),
                cantidad_ingrediente: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "La cantidad del ingrediente debe ser un número.",
                        "number.integer": "La cantidad del ingrediente debe ser un número entero.",
                        "number.positive": "La cantidad del ingrediente debe ser un número positivo.",
                        "any.required": "La cantidad del ingrediente es obligatoria.",
                    }),
            })
        )
        .optional()
        .messages({
            "array.base": "Los ingredientes deben ser un arreglo de objetos.",
        }),
    utensilios: Joi.array()
        .items(
            Joi.object({
                id_utensilio: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "El id del utensilio debe ser un número.",
                        "number.integer": "El id del utensilio debe ser un número entero.",
                        "number.positive": "El id del utensilio debe ser un número positivo.",
                        "any.required": "El id del utensilio es obligatorio.",
                    }),
                cantidad_utensilio: Joi.number()
                    .integer()
                    .positive()
                    .required()
                    .messages({
                        "number.base": "La cantidad del utensilio debe ser un número.",
                        "number.integer": "La cantidad del utensilio debe ser un número entero.",
                        "number.positive": "La cantidad del utensilio debe ser un número positivo.",
                        "any.required": "La cantidad del utensilio es obligatoria.",
                    }),
            })
        )
        .optional()
        .messages({
            "array.base": "Los utensilios deben ser un arreglo de objetos.",
        }),
});
