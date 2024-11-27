"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createPedido,
  deletePedido, 
  getAllPedidos, 
  getPedidoById,
  updatePedido,
   } from "../controllers/pedido.controller.js";

const router = Router();

// Middleware para autenticar y verificar rol
router
  .use(authenticateJwt) // Autenticar con JWT
  .use(isAdmin); // Verificar rol de administrador

// Rutas
router.post("/", createPedido); // Ruta para crear un nuevo pedido
router.get("/", getAllPedidos); // Ruta para obtener todos los pedidos
router.get("/:id_pedido", getPedidoById); // Ruta para obtener un pedido específico
router.patch("/:id_pedido", updatePedido); // Ruta para actualizar un pedido específico
router.delete("/:id_pedido", deletePedido); // Ruta para eliminar un pedido específico

export default router;