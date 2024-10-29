"use strict";
import { Router } from "express";
import { 
  createMerma, 
  getMermas, 
} from "../controllers/mermas.controller.js"

const router = Router();

router
  .post('/create_tipo_utensilio', createMerma)
  .get('/get_tipo_utensilio:id', getMermas)

export default router;