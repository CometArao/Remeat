import express from 'express';
import {
  createComandaController,
  getAllComandasController,
  deleteComandaController,
  completeComandaController,
  getComandaByIdController,
  addPlatilloToComandaController,
  getComandasConPlatillosController,
  getPlatillosDelDiaController,
  removePlatilloFromComandaController
} from '../controllers/comanda.controller.js';
import { authenticateJwt } from '../middlewares/authentication.middleware.js';
import {isMesero, verificarHorarioLaboral} from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Aplica el middleware de autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas protegidas por el middleware de autorización
router.post('/', isMesero,verificarHorarioLaboral,createComandaController); // Crear una comanda
router.get('/', isMesero,verificarHorarioLaboral, getAllComandasController); // Obtener todas las comandas
router.get('/:id', isMesero, verificarHorarioLaboral, getComandaByIdController); // Obtener una comanda por ID
router.delete('/:id', isMesero, verificarHorarioLaboral, deleteComandaController); // Eliminar una comanda (solo admins)
router.patch('/:id/complete', isMesero, verificarHorarioLaboral, completeComandaController); // Completar una comanda
router.post('/:id/platillos', isMesero, verificarHorarioLaboral, addPlatilloToComandaController); // Añadir un platillo a una comanda
router.get('/comandas/platillos', /*isMesero,*/ verificarHorarioLaboral, getComandasConPlatillosController); // Obtener comandas con platillos
router.get('/comanda/menuplatillo', isMesero, verificarHorarioLaboral, getPlatillosDelDiaController); // Obtener platillos del día
router.delete('/:id/platillos/:platilloId', isMesero,verificarHorarioLaboral, removePlatilloFromComandaController); // Eliminar un platillo de una comanda

export default router;
