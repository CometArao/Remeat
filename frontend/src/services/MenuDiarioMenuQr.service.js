import axios from './root.service';


export const generateMenuQRCode = async (token) => {
  const response = await axios.get('/menus/menu/qr', {
      headers: {
          Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
  });
  return response.data;
};
