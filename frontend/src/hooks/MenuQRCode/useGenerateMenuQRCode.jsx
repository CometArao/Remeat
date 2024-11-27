import { useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie'; // Asegúrate de tener instalada esta dependencia.

const useGenerateMenuQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    const token = cookies.get('jwt-auth'); // Recuperar el token desde las cookies
    try {
      const response = await axios.get('http://localhost:3000/api/menus/menu/qr', {
        withCredentials: true, // Incluir cookies en la solicitud
        headers: {
          Authorization: `Bearer ${token}` // Configurar el token si es necesario
        }
      });
      if (response.data.status === 'Success' && response.data.data.qrCode) {
        setQrCode(response.data.data.qrCode);
      } else {
        throw new Error(response.data.message || 'Error al generar el código QR');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { qrCode, generateQRCode, loading, error };
};

export default useGenerateMenuQRCode;
