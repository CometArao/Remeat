"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin,
    verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .post("/login", login)
  .post("/logout", logout)
  // Solo permite el registro si el usuario es administrador
  .post("/register", authenticateJwt, isAdmin, verificarHorarioLaboral, register);

export default router;