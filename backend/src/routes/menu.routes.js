"use strict";
import { Router } from "express";
import {
    createMenuController,
    deleteMenuController,
    getMenuByIdController,
    getMenuQRCodeController,
    getMenusController,
    updateMenuController,
    activarMenuController,
} from "../controllers/menu.controller.js";

import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { isMesero, authorizeRoles, verificarHorarioLaboral } from '../middlewares/authorization.middleware.js';


const router = Router();

router.use(authenticateJwt)
    .use(verificarHorarioLaboral);
router
    .get("/menu/qr",isMesero, getMenuQRCodeController)
    .get("/", authorizeRoles(["cocinero", "administrador","mesero"]),getMenusController)
    .get("/:id",authorizeRoles(["cocinero", "administrador","mesero"]), getMenuByIdController)
    .post("/",authorizeRoles(["cocinero", "administrador"]), createMenuController)
    .patch("/:id",authorizeRoles(["cocinero", "administrador"]), updateMenuController)
    .patch("/activar/:id",authorizeRoles(["cocinero", "administrador"]), activarMenuController)
    .delete("/:id", authorizeRoles(["cocinero", "administrador"]), deleteMenuController);

export default router;
