import axios from 'axios';

export const generateMenuQRCode = async () => {
  const response = await axios.get('http://localhost:3000/api/menus/menu/qr', {
    withCredentials: true, // Asegurar que las cookies se incluyan en la solicitud
  });
  return response.data;
};
