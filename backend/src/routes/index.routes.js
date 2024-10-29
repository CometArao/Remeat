"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import utensiliosRoutes from "./utensilios.routes.js"
import informesRoutes from "./informes.routes.js"
import horariosLaborales from "./horario_laboral.routes.js"
import horariosDias from "./horario_dia.routes.js"
import mermaRoutes from "./merma.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/utensilios", utensiliosRoutes)
    .use("/informes", informesRoutes)
    .use("/horarios-laborales", horariosLaborales)
    .use("/horarios-dias", horariosDias)
    .use("/merma", mermaRoutes)

export default router;