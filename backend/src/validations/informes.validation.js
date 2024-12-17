"use strict"
import Joi from "joi"

//Utensilios
//Menu Platillo
//ventas platillo
//
export const informesValidation = Joi.object({
    ids: Joi.array()
    .required()
    .min(1)
    .items(
        Joi.number()
        .integer()
        .positive()
        .message({
            "number.base": "Las id deben ser un número",
            "number.integer": "Debe ser un entero",
            "number.positive": "El id debe ser un numero positivo"
        })
    )
})