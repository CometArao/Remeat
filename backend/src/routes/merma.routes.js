"use strict";
import { Router } from "express";
import { 
  createMerma, 
  getMermas, 
} from "../controllers/mermas.controller.js"

const router = Router();

router
  .post('/create_merma', createMerma)
  .get('/get_mermas', getMermas)

export default router;