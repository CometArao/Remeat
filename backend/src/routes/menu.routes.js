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

const router = Router();
router
    .get("/menu/qr", getMenuQRCodeController)
    .get("/", getMenusController)
    .get("/:id_menu", getMenuByIdController)
    .post("/", createMenuController)
    .patch("/:id_menu", updateMenuController)
    .delete("/:id_menu", deleteMenuController);

export default router;