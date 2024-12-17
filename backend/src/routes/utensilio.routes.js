"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createTipoUtensilioController,
  createUtensilioController,
  deleteTipoUtensilioController,
  deleteUtensilioController,
  getTiposUtensilioController,
  getTipoUtensilioController,
  getUtensilioController,
  getUtensiliosController,
  getUtensiliosDetalladoController,
  updateTipoUtensilioController,
  updateUtensilioController
} from "../controllers/utensilio.controller.js";
import { authorizeRoles, verificarHorarioLaboral } from "../middlewares/authorization.middleware.js";

const router = Router()
  .use(authenticateJwt)  
  .use(authorizeRoles(["administrador", "cocinero"]))
  .use(verificarHorarioLaboral)

// Rutas para tipo_utensilio
router
  .post("/tipo", createTipoUtensilioController)            // Crear tipo de utensilio
  .get("/tipo/:id", getTipoUtensilioController)            // Obtener un tipo de utensilio específico por ID
  .get("/tipo", getTiposUtensilioController)               // Obtener todos los tipos de utensilios
  .patch("/tipo/:id", updateTipoUtensilioController)       // Actualizar un tipo de utensilio específico
  .delete("/tipo/:id", deleteTipoUtensilioController);     // Eliminar un tipo de utensilio específico

// Rutas para utensilio
router
  .post("/", createUtensilioController)                    // Crear utensilio
  .get("/:id", getUtensilioController)                     // Obtener un utensilio específico por ID
  .get("/", getUtensiliosController)                       // Obtener todos los utensilios
  .get("/detallado/detallado", getUtensiliosDetalladoController)     // Obtener todos los utensilios y relaciones
  .patch("/:id", updateUtensilioController)                // Actualizar un utensilio específico
  .delete("/:id", deleteUtensilioController);              // Eliminar un utensilio específico

export default router;
