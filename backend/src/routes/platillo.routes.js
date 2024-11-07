"use strict";
import { Router } from "express";
import {
    assignPriceToPlatilloController,
    createPlatilloController,
    deletePlatilloController,
    getPlatilloByIdController,
    getPlatillosController,
    updatePlatilloController,
    // Nueva ruta para asignar precio
} from "../controllers/platillo.controller.js";
import { isChef } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
    .use(authenticateJwt)  // Aplicar autenticación a todas las rutas
    .get("/", getPlatillosController)                   // Obtener todos los platillos
    .get("/:id_platillo", getPlatilloByIdController)    // Obtener un platillo específico por ID
    .post("/", isChef, createPlatilloController)                // Crear platillo (sin precio)
    .patch("/:id_platillo", isChef, updatePlatilloController)   // Actualizar platillo
    .put("/cambiar-precio", assignPriceToPlatilloController) // Asignar precio al platillo (solo admin)
    .delete("/:id_platillo", deletePlatilloController); // Eliminar un platillo

export default router;