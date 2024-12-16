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
  .get("/:id_horario_laboral", getHorarioLaboralById)            // Obtener un horario laboral por ID
  .put("/:id_horario_laboral", updateHorarioLaboral)             // Actualizar un horario laboral por ID
  .delete("/:id_horario_laboral", deleteHorarioLaboral);         // Eliminar un horario laboral por ID

export default router;
