"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import horariosLaborales from "./horario_laboral.routes.js"
import horariosDias from "./horario_dia.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/horarios-laborales", horariosLaborales)
    .use("/horarios-dias", horariosDias)

export default router;