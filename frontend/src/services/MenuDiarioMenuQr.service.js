import axios from './root.service';

const handleErrorResponse = (error) => {
  if (error.response?.status === 403) {
      console.warn('Acceso denegado: fuera de horario laboral.');
      window.location.href = '/fuera-horario'; 
  } else {
      console.error('Error:', error);
  }
  throw error; 
};

export const generateMenuQRCode = async (token) => {
  try {
    const response = await axios.get('/menus/menu/qr', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error); 
    return null; 
  }
};