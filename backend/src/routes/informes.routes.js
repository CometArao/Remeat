"use strict";
import { Router } from "express";
import { getStockIngrediente, getStockUtensilio, getVentasPlatillo, getPlatillosMenu} from "../controllers/informes.controller.js"

const router = Router();

router
    //grafico de linea
    .get("/get_stock_ingrediente:id", getStockIngrediente)
    .get("/get_stock_utensilio:id", getStockUtensilio)
    .get("/get_ingresos_venta")
    .get("/get_costos")
    .get("/get_utilidades")
    .get("/get_utilidades")
    //grafico circular
    .get("/get_platillos_vendidos", getVentasPlatillo)
    .get("/get_platillo_menu", getPlatillosMenu)

export default router;