"use strict";
import { Router } from "express";
import { createHorarioDia,getHorariosDia,
    getHorarioDiaById,
    updateHorarioDia,
    deleteHorarioDia } from "../controllers/horario_dia.controller.js";

const router = Router();

router.post("/", createHorarioDia); // Crear un horario_dia
router.get("/", getHorariosDia); // Obtener todos los horarios_dia
router.get("/:id", getHorarioDiaById); // Obtener un horario_dia por ID
router.put("/:id", updateHorarioDia); // Actualizar un horario_dia por ID
router.delete("/:id", deleteHorarioDia); // Eliminar un horario_dia por ID

export default router;
