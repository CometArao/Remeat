"use strict";
import { Router } from "express";
import { getCostos, getIngresosPorVentas, getPlatillosMenu, 
    getStockIngrediente, getStockUtensilio, getVentasPlatillo } from "../controllers/informes.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
const router = Router();

router
    .use(authenticateJwt)  // Aplicar autenticación a todas las rutas
    .post("/get_stock_ingrediente", getStockIngrediente)
    /*grafico de linea
    recibe un json(body) una lista de todos los ingredientes que
    se nesesitan
    {
        "ids": [
        1,2,3,...
        ] 
    }
    */
    .post("/get_stock_utensilio", getStockUtensilio)
    .post("/get_ingresos_venta", getIngresosPorVentas)
    //.post("/get_ventas_tipo", )
    .post("/get_costos", getCostos)
    .post("/get_utilidades")
    //grafico circular
    .post("/get_platillos_vendidos", getVentasPlatillo)
    .post("/get_platillo_menu", getPlatillosMenu)

export default router;