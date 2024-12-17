"use strict";
import { Router } from "express";
import { 
  createMerma, 
  deleteMerma, 
  getMerma, 
  getMermas,
  updateMerma
} from "../controllers/mermas.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles, verificarHorarioLaboral } from "../middlewares/authorization.middleware.js";

const router = Router()
  .use(authenticateJwt)  
  .use(authorizeRoles(["administrador"]))
  .use(verificarHorarioLaboral)

router
  .use(authenticateJwt)
  .post("/create_merma", createMerma)
  .get("/get_all_mermas", getMermas)
  .get("/get_merma:id", getMerma)
  .patch("/update_merma", updateMerma)
  .delete("/delete_merma:id", deleteMerma)
export default router;