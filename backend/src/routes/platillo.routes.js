"use strict";
import { Router } from "express";
import {
    assignPriceToPlatilloController,
    confirmarPlatilloController,
    createPlatilloController,
    deletePlatilloController,
    getPlatilloByIdController,
    getPlatillosController,
    updatePlatilloController,
} from "../controllers/platillo.controller.js";
import { isChef, isMesero } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";


const router = Router();

router
    .use(authenticateJwt)  // Aplicar autenticación a todas las rutas
    .get("/", isChef, isMesero, getPlatillosController)                   // Obtener todos los platillos
    .get("/:id_platillo",isChef, isMesero, getPlatilloByIdController)    // Obtener un platillo específico por ID
    .post("/", isChef, createPlatilloController)                // Crear platillo (sin precio)
    .patch("/:id_platillo", isChef, updatePlatilloController)   // Actualizar platillo
    .post("/confirmar/:id_platillo/:id_comanda", isChef, confirmarPlatilloController) // Confirmar estado de platillo
    .put("/cambiar-precio", assignPriceToPlatilloController) // Asignar precio al platillo (solo admin)
    .delete("/:id_platillo",isChef, deletePlatilloController); // Eliminar un platillo

export default router;