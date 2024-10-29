"use strict";
import { Router } from "express";
import {
  createHorarioLaboral,
  deleteHorarioLaboral,
  getHorarioLaboralById,
  getHorariosLaborales,
  updateHorarioLaboral,
} from "../controllers/horario_laboral.controller.js";

const router = Router();

router
  .post("/", createHorarioLaboral)               // Crear un nuevo horario laboral
  .get("/", getHorariosLaborales)                // Obtener todos los horarios laborales
  .get("/:id", getHorarioLaboralById)            // Obtener un horario laboral por ID
  .put("/:id", updateHorarioLaboral)             // Actualizar un horario laboral por ID
  .delete("/:id", deleteHorarioLaboral);         // Eliminar un horario laboral por ID

export default router;
