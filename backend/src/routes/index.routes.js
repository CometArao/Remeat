"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import utensiliosRoutes from "./utensilios.routes.js"
import informesRoutes from "./informes.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/usuarios", usuariosRoutes)
    .use("/utensilios", utensiliosRoutes)
    .use("/informes", informesRoutes)

export default router;