"use strict";
import { Router } from "express";
import { getCostos, getIngresosPorVentas, getPlatillosMenu, 
    getStockIngrediente, getStockUtensilio, getVentasPlatillo } from "../controllers/informes.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
const router = Router();

router
    .use(authenticateJwt)  // Aplicar autenticación a todas las rutas
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
    .post("/get_ingresos_venta", getIngresosPorVentas)
    .get("/get_costos", getCostos)
    .get("/get_utilidades")
    .get("/get_utilidades")
    //grafico circular
    .get("/get_platillos_vendidos", getVentasPlatillo)
    .get("/get_platillo_menu", getPlatillosMenu)

export default router;