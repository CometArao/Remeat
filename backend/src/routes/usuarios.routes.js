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
  .use(isAdmin);

router
  .post("/", createUser)        // Crear un nuevo usuario
  .get("/", getUsers)         // Obtener todos los usuarios
  .get("/:id", getUser)        // Obtener un usuario específico por ID
  .patch("/:id", updateUser)     // Actualizar un usuario específico por ID
  .delete("/:id", deleteUser); // Eliminar un usuario específico por ID

export default router;
