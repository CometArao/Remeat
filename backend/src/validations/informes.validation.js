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

//export const extraerPedidosValidacion = Joi.array()
    //.items(
        //Joi.object({
            //fecha_compra: Joi.date(),
            //ingrediente: Joi.object()
                //.pattern(
                    ///^\d+$/,                  // The key must be a positive integer (as a string)
                    //Joi.object({
                        //cantidad: Joi.number()
                        //.positive()
                        //.integer()
                        //.message({
                            //"number.base": "La cantidad debe ser un numero",
                            //"number.integer": "La cantidad un entero",
                            //"number.positive": "La cantidad debe ser positivo"
                        //}),
                        //costo_total: Joi.number()
                        //.positive()
                        //.integer()
                        //.message({
                            //"number.base": "La costo_total debe ser un numero",
                            //"number.integer": "La costo_total un entero",
                            //"number.positive": "La costo_total debe ser positivo"
                        //}),
                        //costo_unitario: Joi.number()
                        //.positive()
                        //.integer()
                        //.message({
                            //"number.base": "La costo_untario debe ser un numero",
                            //"number.integer": "La costo_unitario un entero",
                            //"number.positive": "La costo_unitario debe ser positivo"
                        //})
                    //})
                //)
        //})
    //)