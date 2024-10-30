"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import horariosLaborales from "./horario_laboral.routes.js";
import horariosDias from "./horario_dia.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import ingredienteRoutes from "./ingrediente.routes.js"; // Importar las rutas de ingrediente y tipo_ingrediente

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/horarios-laborales", horariosLaborales)
    .use("/horarios-dias", horariosDias)
    .use("/pedidos", pedidoRoutes)
    .use("/ingredientes", ingredienteRoutes); // Añadir las rutas de ingrediente y tipo_ingrediente

export default router;
