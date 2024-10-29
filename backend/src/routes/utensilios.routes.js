"use strict";
import { Router } from "express";
import { 
  createTipoUtensilio, 
  getTipoUtensilio, 
  getTiposUtensilio, 
  updateTipoUtensilio, 
  deleteTipoUtensilio,
  createUtensilio,
  getUtensilio,
  getUtensilios,
  updateUtensilio,
  deleteUtensilio
} from "../controllers/utensilios.controller.js"

const router = Router();

router//tipo_utensilio
  .post('/create_tipo_utensilio', createTipoUtensilio)
  .get('/get_tipo_utensilio:id', getTipoUtensilio)
  .get('/get_tipos_utensilio', getTiposUtensilio)
  .patch('/update_tipo_utensilio:id', updateTipoUtensilio)
  .delete('/delete_tipos_utensilio:id', deleteTipoUtensilio)
  //utensilio
  .post("/create_utensilio", createUtensilio)
  .get("/get_utensilio:id", getUtensilio)
  .get("/get_all_utensilio", getUtensilios)
  .patch("/update_utensilios:id", updateUtensilio)
  .delete("/delete_utensilio:id", deleteUtensilio)

export default router;