"use strict";
import { Router } from "express";
import { getIngresosPorVentas, getPlatillosMenu, getStockIngrediente, 
    getStockUtensilio, getVentasPlatillo } from "../controllers/informes.controller.js"

const router = Router();

router
    .get("/get_stock_ingrediente", getStockIngrediente)
    /*grafico de linea
    recibe un json(body) una lista de todos los ingredientes que
    se nesesitan
    {
        "ids": [
        1,2,3,...
        ] 
    }
    */
    .get("/get_stock_utensilio", getStockUtensilio)
    .get("/get_ingresos_venta", getIngresosPorVentas)
    .get("/get_costos")
    .get("/get_utilidades")
    .get("/get_utilidades")
    //grafico circular
    .get("/get_platillos_vendidos", getVentasPlatillo)
    .get("/get_platillo_menu", getPlatillosMenu)

export default router;