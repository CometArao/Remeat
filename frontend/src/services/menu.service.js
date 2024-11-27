import axios from 'axios';

export const generateMenuQRCode = async (menuId, token) => {
  const response = await axios.post(`http://localhost:3000/api/menu/${menuId}/generateQRCode`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
