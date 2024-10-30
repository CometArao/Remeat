// backend/src/routes/comanda.routes.js
import express from 'express';
import {
  createComandaController,
  getAllComandasController,
  updateComandaController,
  deleteComandaController,
  completeComandaController,
  getComandaByIdController,
  addPlatilloToComandaController,
} from '../controllers/comanda.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';


const router = express.Router();

router.use(authenticateJwt);

router.post('/', createComandaController);
router.get('/', getAllComandasController);
router.get('/:id', getComandaByIdController);
router.put('/:id', updateComandaController);
router.delete('/:id', deleteComandaController);
router.patch('/:id/complete', completeComandaController);


// Nueva ruta para añadir platillos a la comanda
router.post('/:id/platillos', addPlatilloToComandaController);

export default router;