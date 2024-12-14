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
import { isMesero, authorizeRoles } from '../middlewares/authorization.middleware.js';


const router = Router();

router.use(authenticateJwt);
router
    .get("/menu/qr",isMesero, getMenuQRCodeController)
    .get("/", getMenusController)
    .get("/:id", getMenuByIdController)
    .post("/",authorizeRoles(["cocinero", "administrador"]), createMenuController)
    .patch("/:id",authorizeRoles(["cocinero", "administrador"]), updateMenuController)
    .patch("/activar/:id",authorizeRoles(["cocinero", "administrador"]), activarMenuController)
    .delete("/:id", authorizeRoles(["cocinero", "administrador"]), deleteMenuController);

export default router;
