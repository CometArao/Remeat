"use strict";
import { Router } from "express";
import { isAdmin,
  verificarHorarioLaboral
} from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createHorarioLaboral,
  deleteHorarioLaboral,
  getHorarioLaboralById,
  getHorariosLaborales,
  updateHorarioLaboral,
} from "../controllers/horario_laboral.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin)
  .use(verificarHorarioLaboral);

router
  .post("/", createHorarioLaboral)
  .get("/", getHorariosLaborales)
  .get("/:id_horario_laboral", getHorarioLaboralById)
  .put("/:id_horario_laboral", updateHorarioLaboral)
  .delete("/:id_horario_laboral", deleteHorarioLaboral);

export default router;
