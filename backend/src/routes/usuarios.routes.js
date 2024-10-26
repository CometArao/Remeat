"use strict";
import { Router } from "express";
import { find } from "../controllers/usuario.controller.js"

const router = Router();

router
  .get('/find', find)

export default router;