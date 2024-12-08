import axios from './root.service';


export const generateMenuQRCode = async () => {
    const response = await axios.get('/menus/menu/qr', {
      withCredentials: true, 
    });
    return response.data;
  };




