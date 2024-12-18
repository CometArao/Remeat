"use strict";
import { Router } from "express";
import { isAdmin,
    verificarHorarioLaboral
 } from "../middlewares/authorization.middleware.js";
 import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { createHorarioDia,getHorariosDia,
    getHorarioDiaById,
    updateHorarioDia,
    deleteHorarioDia } from "../controllers/horario_dia.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin)
  .use(verificarHorarioLaboral);

router.post("/", createHorarioDia);
router.get("/", getHorariosDia);
router.get("/:id", getHorarioDiaById);
router.put("/:id", updateHorarioDia);
router.delete("/:id", deleteHorarioDia);

export default router;
