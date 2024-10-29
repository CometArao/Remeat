// backend/src/routes/comanda.routes.js
import express from "express";
import {
  completeComandaController,
  createComandaController,
  deleteComandaController,
  getComandasController,
  updateComandaController,
} from "../controllers/comanda.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(authenticateJwt);

router.post("/", createComandaController);
router.get("/", getComandasController);
router.put("/:id", updateComandaController);
router.delete("/:id", deleteComandaController);
router.patch("/:id/complete", completeComandaController);

export default router;
