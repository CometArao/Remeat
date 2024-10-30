"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createPedido } from "../controllers/pedido.controller.js";

const router = Router();

router
  .use(authenticateJwt) // Autenticar con JWT
  .use(isAdmin); // Verificar rol de administrador

router
  .post("/", createPedido); // Ruta para crear un nuevo pedido

export default router;
