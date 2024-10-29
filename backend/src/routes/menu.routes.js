// backend/src/routes/menu.routes.js
import express from 'express';
import { getMenuQRCodeController } from '../controllers/menu.controller.js';

const router = express.Router();

router.get('/menu/qr', getMenuQRCodeController);

export default router;
