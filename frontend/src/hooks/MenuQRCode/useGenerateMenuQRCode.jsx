import { useState } from 'react';
import { generateMenuQRCode } from '../../services/menu.service';
import cookies from 'js-cookie';

const useGenerateMenuQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQRCode = async () => {
    if (loading) return; 
    setLoading(true);
    setError(null); 
    const token = cookies.get('jwt-auth');
    try {
      console.log('Solicitando QR desde el backend...');
      const data = await generateMenuQRCode(token); 
      console.log('Respuesta del backend:', data);
      setQrCode(data.qrCode); 
    } catch (err) {
      console.error('Error generando el QR:', err.response || err.message);
      setError(err);
    } finally {
      setLoading(false); 
    }
  };

  return { qrCode, generateQRCode, loading, error };
};

export default useGenerateMenuQRCode;
