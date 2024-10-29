"use strict";
import { Router } from "express";
import { createHorarioDia } from "../controllers/horario_dia.controller.js";

const router = Router();

router.post("/", createHorarioDia); // Crear un horario_dia

export default router;
