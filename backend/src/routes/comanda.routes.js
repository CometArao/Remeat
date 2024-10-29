// backend/src/routes/comanda.routes.js
import express from 'express';
import {
  createComandaController,
  getComandasController,
  updateComandaController,
  deleteComandaController,
  completeComandaController,
} from '../controllers/comanda.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.use(authenticateJwt);

router.post('/comandas', createComandaController);
router.get('/comandas', getComandasController);
router.put('/comandas/:id', updateComandaController);
router.delete('/comandas/:id', deleteComandaController);
router.patch('/comandas/:id/complete', completeComandaController);

export default router;
