"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import menuRoutes from "./menu.routes.js";
import platilloRoutes from "./platillo.routes.js";
import horariosLaborales from "./horario_laboral.routes.js"
import horariosDias from "./horario_dia.routes.js"
import comandaRoutes from "./comanda.routes.js"
import pedidoRoutes from "./pedido.routes.js";
import ingredienteRoutes from "./ingrediente.routes.js"; // Importar las rutas de ingrediente y tipo_ingrediente

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/menus", menuRoutes)
    .use("/platillos", platilloRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/horarios-laborales", horariosLaborales)
    .use("/horarios-dias", horariosDias)
    .use("/comandas", comandaRoutes)
    .use("/pedidos", pedidoRoutes)
    .use("/ingredientes", ingredienteRoutes); // Añadir las rutas de ingrediente y tipo_ingrediente

export default router;
