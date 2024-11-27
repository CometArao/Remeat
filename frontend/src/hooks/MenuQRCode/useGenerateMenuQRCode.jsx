import { useState } from 'react';
import axios from 'axios';

const useGenerateMenuQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/menus/menu/qr');
      if (response.data.status === 'Success' && response.data.data.qrCode) {
        setQrCode(response.data.data.qrCode); // Aquí se almacena el base64 del QR.
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
