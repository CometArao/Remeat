"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import horariosLaborales from "./horario_laboral.routes.js"
import horariosDias from "./horario_dia.routes.js"
import comandasRoutes from "./comanda.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/horarios-laborales", horariosLaborales)
    .use("/horarios-dias", horariosDias)
    .use("/comandas", comandasRoutes);

export default router;