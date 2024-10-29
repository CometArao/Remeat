// backend/src/controllers/menu.controller.js
import { generateMenuQRCode } from '../services/menu.service.js';
import { handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

export async function getMenuQRCodeController(req, res) {
  try {
    const qrCode = await generateMenuQRCode();
    handleSuccess(res, 200, 'QR del menú generado exitosamente', { qrCode });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
