"use strict";
import { Router } from "express";
import { isAdmin, isChef } from "../middlewares/authorization.middleware.js";
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
import {
  createMedidaController,
  deleteMedidaController,
  getMedidaByIdController,
  getMedidasController,
  updateMedidaController

 } from "../controllers/unidad_medida.controller.js";

const router = Router();

// Autenticación y autorización para todas las rutas de ingredientes
//router.use(authenticateJwt).use(isChef);

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

  //Rutas para unidad de medida
  router
  .post("/unidades-medidas", createMedidaController)                  // Crear una nueva unidad de medida
  .get("/unidades-medidas", getMedidasController)                     // Obtener toddas las unidades de medida
  .get("/unidades-medidas/:id",getMedidaByIdController)               // Obtener una unidad de medida por ID
  .put("/unidades-medidas/:id", updateMedidaController)               // Actualizar una unidad de medida por ID
  .delete("/unidades-medidas/:id", deleteMedidaController);       // Eliminar una unidad de medida por ID
            

export default router;
