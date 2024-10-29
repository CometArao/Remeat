// backend/src/services/menu.service.js
import QRCode from 'qrcode';

export async function generateMenuQRCode() {
  const menuUrl = `${process.env.BASE_URL}/menu`;
  return QRCode.toDataURL(menuUrl);
}
