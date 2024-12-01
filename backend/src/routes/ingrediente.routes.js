"use strict";
import { Router } from "express";
import { isAdmin, isChef } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createIngredienteController,
  createTipoIngredienteController,
  deleteIngredienteController,
  deleteTipoIngredienteController,
  getIngredienteController,
  getIngredientesController,
  getTipoIngredienteController,
  getTipoIngredientesController,
  updateIngredienteController,
  updateTipoIngredienteController
} from "../controllers/ingrediente.controller.js";

const router = Router();

// Autenticación y autorización para todas las rutas de ingredientes
//router.use(authenticateJwt).use(isChef);

// Rutas para Tipo Ingrediente
router
  .post("/tipo", createTipoIngredienteController)          // Crear un nuevo tipo de ingrediente
  .get("/tipo", getTipoIngredientesController)             // Obtener todos los tipos de ingredientes
  .get("/tipo/:id_tipo_ingrediente", getTipoIngredienteController)          // Obtener un tipo de ingrediente por id
  .patch("/tipo/:id_tipo_ingrediente", 
    updateTipoIngredienteController)       // Actualizar un tipo de ingrediente por ID
  .delete("/tipo/:id_tipo_ingrediente", deleteTipoIngredienteController);   // Eliminar un tipo de ingrediente por ID

// Rutas para Ingrediente
router
  .post("/", createIngredienteController)                  // Crear un nuevo ingrediente
  .get("/", getIngredientesController)                      // Obtener un ingrediente por id
  .get("/:id", getIngredienteController)                     // Obtener todos los ingredientes
  .put("/:id", updateIngredienteController)                // Actualizar un ingrediente por ID
  .delete("/:id", deleteIngredienteController);            // Eliminar un ingrediente por ID

export default router;
