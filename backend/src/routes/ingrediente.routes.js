"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createIngrediente,
  createTipoIngrediente,
  deleteIngrediente,
  deleteTipoIngrediente,
  getIngredientes,
  getTipoIngredientes,
  updateIngrediente,
  updateTipoIngrediente
} from "../controllers/ingrediente.controller.js";

const router = Router();

// Autenticación y autorización para todas las rutas de ingredientes
router.use(authenticateJwt).use(isAdmin);

// Rutas para Tipo Ingrediente
router
  .post("/tipo", createTipoIngrediente)          // Crear un nuevo tipo de ingrediente
  .get("/tipo", getTipoIngredientes)             // Obtener todos los tipos de ingredientes
  .put("/tipo/:id", updateTipoIngrediente)       // Actualizar un tipo de ingrediente por ID
  .delete("/tipo/:id", deleteTipoIngrediente);   // Eliminar un tipo de ingrediente por ID

// Rutas para Ingrediente
router
  .post("/", createIngrediente)                  // Crear un nuevo ingrediente
  .get("/", getIngredientes)                     // Obtener todos los ingredientes
  .put("/:id", updateIngrediente)                // Actualizar un ingrediente por ID
  .delete("/:id", deleteIngrediente);            // Eliminar un ingrediente por ID

export default router;
