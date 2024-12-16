"use strict";
import { Router } from "express";
import { getCostos, getIngresosPorVentas,  
    getStockIngrediente, getStockUtensilio } from "../controllers/informes.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
const router = Router();

router
    .use(authenticateJwt)  // Aplicar autenticación a todas las rutas
    .use(isAdmin)
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

export default router;