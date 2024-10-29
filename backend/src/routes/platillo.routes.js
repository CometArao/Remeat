"use strict";
import { Router } from "express";
import {
    createPlatilloController,
    deletePlatilloController,
    getPlatilloByIdController,
    getPlatillosController,
    updatePlatilloController,
} from "../controllers/platillo.controller.js";

const router = Router();
router
    .get("/", getPlatillosController)
    .get("/:id_platillo", getPlatilloByIdController)
    .post("/", createPlatilloController)
    .patch("/:id_platillo", updatePlatilloController)
    .delete("/:id_platillo", deletePlatilloController);

export default router;