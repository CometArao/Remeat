import axios from 'axios';

export const generateMenuQRCode = async (token) => {
  const response = await axios.get(
    `http://localhost:3000/api/menus/menu/qr`, 
    {
      headers: { Authorization: `Bearer ${token}` }, 
    }
  );
  return response.data;
};
