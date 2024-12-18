"use strict";
import { Router } from "express";
import { isAdmin,
  verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { confirmarPedidoController,
  createPedido,
  deletePedido, 
  getAllPedidos,
  getPedidoById,
  updatePedido,
   } from "../controllers/pedido.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin)
  .use(verificarHorarioLaboral);

// Rutas para manejar pedidos
router.post("/", createPedido)
  .get("/", getAllPedidos)
  .get("/:id_pedido", getPedidoById)
  .patch("/:id_pedido", updatePedido)
  .post("/:id/ingresar", confirmarPedidoController) // Ruta para ingresar un pedido al sistema
  .delete("/:id_pedido", deletePedido);

export default router;