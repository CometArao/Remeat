"use strict";
import { Router } from "express";
import { getCostos, getCostosNormal, getIngresosPorVentas,  
    getStockIngrediente, getStockUtensilio, getPlatillosMenu } from "../controllers/informes.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles, verificarHorarioLaboral } from "../middlewares/authorization.middleware.js";
const router = Router()
  .use(authenticateJwt)  
  .use(authorizeRoles(["administrador"]))
  .use(verificarHorarioLaboral)
router
    .post("/get_stock_ingrediente", getStockIngrediente)
    .post("/get_stock_utensilio", getStockUtensilio)
    .post("/get_ingresos_venta", getIngresosPorVentas)
    .post("/get_costos", getCostos)
    .post("/get_costos/normal", getCostosNormal)
    .post("/get_platillos_menu", getPlatillosMenu)
export default router;