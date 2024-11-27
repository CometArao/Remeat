"use strict";
import { Router } from "express";
import {
    createMenuController,
    deleteMenuController,
    getMenuByIdController,
    getMenuQRCodeController,
    getMenusController,
    updateMenuController,
} from "../controllers/menu.controller.js";

import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import { isMesero } from '../middlewares/authorization.middleware.js';


const router = Router();

router.use(authenticateJwt);
router
    .get("/menu/qr",isMesero, getMenuQRCodeController)
    .get("/", getMenusController)
    .get("/:id", getMenuByIdController)
    .post("/", createMenuController)
    .patch("/:id", updateMenuController)
    .delete("/:id", deleteMenuController);

export default router;
