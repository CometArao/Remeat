"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser
} from "../controllers/usuario.controller.js";

const router = Router();

router
  .use(authenticateJwt)
 

router
  .post("/", isAdmin, createUser)        // Crear un nuevo usuario
  .get("/", getUsers)         // Obtener todos los usuarios
  .get("/:id", getUser)        // Obtener un usuario específico por ID
  .patch("/:id", isAdmin, updateUser)     // Actualizar un usuario específico por ID
  .delete("/:id", isAdmin, deleteUser); // Eliminar un usuario específico por ID

export default router;
