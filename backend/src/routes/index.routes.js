"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import menuRoutes from "./menu.routes.js";
import platilloRoutes from "./platillo.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes) 
    .use("/usuarios", usuariosRoutes)
    .use("/menu", menuRoutes)
    .use("/platillo", platilloRoutes);

export default router;