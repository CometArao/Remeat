import express from 'express';
import {
  createComandaController,
  getAllComandasController,
  deleteComandaController,
  completeComandaController,
  getComandaByIdController,
  addPlatilloToComandaController,
  getComandasConPlatillosController,
  getMeserosController,
  getPlatillosDelDiaController,
  removePlatilloFromComandaController
} from '../controllers/comanda.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import {isMesero} from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Aplica el middleware de autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas protegidas por el middleware de autorización
router.post('/', isMesero, createComandaController); // Crear una comanda
router.get('/', isMesero, getAllComandasController); // Obtener todas las comandas
router.get('/:id', isMesero, getComandaByIdController); // Obtener una comanda por ID
router.delete('/:id', isMesero, deleteComandaController); // Eliminar una comanda (solo admins)
router.patch('/:id/complete', isMesero, completeComandaController); // Completar una comanda
router.post('/:id/platillos', isMesero, addPlatilloToComandaController); // Añadir un platillo a una comanda
router.get('/comandas/platillos', /*isMesero,*/ getComandasConPlatillosController); // Obtener comandas con platillos
router.get('/comanda/meseros', isMesero, getMeserosController); // Obtener meseros
router.get('/comanda/menuplatillo', isMesero, getPlatillosDelDiaController); // Obtener platillos del día
router.delete('/:id/platillos/:platilloId', isMesero, removePlatilloFromComandaController); // Eliminar un platillo de una comanda

export default router;
