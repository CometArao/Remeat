import axios from './root.service';

export const generateMenuQRCode = async () => {
  const response = await axios.get('/menus/menu/qr', {
    withCredentials: true, // Asegurar que las cookies se incluyan en la solicitud
  });
  return response.data;
};
