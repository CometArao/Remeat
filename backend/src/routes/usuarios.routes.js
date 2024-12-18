"use strict";
import { Router } from "express";
import { isAdmin,
  verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword
} from "../controllers/usuario.controller.js";

const router = Router();

// Se verifica sesión, autorización y horario laboral
router
  .use(authenticateJwt)
  .use(isAdmin)
  .use(verificarHorarioLaboral);
 
// Rutas para manejar usuarios
router
  .post("/", createUser)
  .get("/", getUsers)
  .get("/:id", getUser)
  .patch("/:id", updateUser)
  .patch("/:id/contrasena", updateUserPassword) // Ruta para actualizar la contraseña de un usuario
  .delete("/:id", deleteUser);

export default router;
