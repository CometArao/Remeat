"use strict";
import { Router } from "express";
import {
    assignPriceToPlatilloController,
    confirmarPlatilloController,
    createPlatilloController,
    deletePlatilloController,
    getFilteredTipoIngredientesController,
    getPlatilloByIdController,
    getPlatillosController,
    updatePlatilloController,
} from "../controllers/platillo.controller.js";
import { isAdmin, isChef, isMesero } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles,
    verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";

// Se verifica sesión, autorización y horario laboral
const router = Router();

router.use(authenticateJwt)
    .use(isAdmin)
    .use(verificarHorarioLaboral);

router
    .get("/", getPlatillosController)                   // Obtener todos los platillos
    .get("/:id_platillo",isChef, isMesero, getPlatilloByIdController)    // Obtener un platillo específico por ID
    .get("/ingredientes/tipo", isChef, getFilteredTipoIngredientesController)
    // Obtener platillos filtrados por tipo de ingrediente
    .post("/", isChef, createPlatilloController)                // Crear platillo (sin precio)
    .patch("/:id_platillo", isChef, updatePlatilloController)   // Actualizar platillo
    .post("/confirmar/:id_platillo/:id_comanda", isChef, confirmarPlatilloController) // Confirmar estado de platillo
    .patch("/cambiar-precio/:id_platillo", authorizeRoles(["administrador"]), assignPriceToPlatilloController)
    .delete("/:id_platillo", isChef, deletePlatilloController); // Eliminar un platillo

export default router;