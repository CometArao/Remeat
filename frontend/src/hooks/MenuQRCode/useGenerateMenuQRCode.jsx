import { useState } from 'react';
import { generateMenuQRCode } from '../../services/menu.service';
import cookies from 'js-cookie';

const useGenerateMenuQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQRCode = async (menuId) => {
    setLoading(true);
    const token = cookies.get('jwt-auth');
    try {
      const data = await generateMenuQRCode(menuId, token);
      setQrCode(data.qrCode); // Ajusta según el backend
    } catch (err) {
      console.error('Error generando el QR:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { qrCode, generateQRCode, loading, error };
};

export default useGenerateMenuQRCode;
