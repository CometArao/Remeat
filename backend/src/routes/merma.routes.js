"use strict";
import { Router } from "express";
import { 
  createMerma, 
  deleteMerma, 
  getMerma, 
  getMermas,
  updateMerma
} from "../controllers/mermas.controller.js"
const router = Router();
router
  .post("/create_merma", createMerma)
  .get("/get_all_mermas", getMermas)
  .get("/get_merma:id", getMerma)
  .patch("/update_merma", updateMerma)
  .delete("/delete_merma:id", deleteMerma)
export default router;