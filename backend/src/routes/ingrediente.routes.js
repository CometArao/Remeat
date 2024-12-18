"use strict";
import { Router } from "express";
import { authorizeRoles,
    verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createIngredienteController,
  createTipoIngredienteController,
  deleteIngredienteController,
  deleteTipoIngredienteController,
  getIngredienteController,
  getIngredientesController,
  getIngredientesDetalladoController,
  getTipoIngredienteController,
  getTipoIngredientesController,
  updateIngredienteController,
  updateTipoIngredienteController
} from "../controllers/ingrediente.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(verificarHorarioLaboral);

// Rutas para Tipo Ingrediente
router
  .post("/tipo", authorizeRoles(["administrador", "cocinero"]), createTipoIngredienteController) 
  // Crear un nuevo tipo de ingrediente
  .get("/tipo", authorizeRoles(["administrador", "cocinero"]), getTipoIngredientesController) 
  // Obtener todos los tipos de ingredientes
  .get("/tipo/:id_tipo_ingrediente", authorizeRoles(["administrador", "cocinero"]), getTipoIngredienteController) 
  // Obtener un tipo de ingrediente por id
  .patch("/tipo/:id_tipo_ingrediente", authorizeRoles(["administrador", "cocinero"]), 
    updateTipoIngredienteController) // Actualizar un tipo de ingrediente por ID
  .delete("/tipo/:id_tipo_ingrediente", authorizeRoles(["administrador", "cocinero"]),
    deleteTipoIngredienteController); // Eliminar un tipo de ingrediente por ID

// Rutas para Ingrediente
router
  .post("/", authorizeRoles(["administrador", "cocinero"]), createIngredienteController) // Crear un nuevo ingrediente
  .get("/", authorizeRoles(["administrador", "cocinero"]), getIngredientesController) // Obtener un ingrediente por id
  .get("/:id", authorizeRoles(["administrador", "cocinero"]), getIngredienteController) 
  // Obtener todos los ingredientes
  .get("/detallado/detallado", authorizeRoles(["administrador"]), getIngredientesDetalladoController) 
  // Obtener todos los utensilios y relaciones
  .put("/:id", authorizeRoles(["administrador", "cocinero"]), updateIngredienteController) 
  // Actualizar un ingrediente por ID
  .delete("/:id", authorizeRoles(["administrador", "cocinero"]), deleteIngredienteController); 
  // Eliminar un ingrediente por ID

export default router;
