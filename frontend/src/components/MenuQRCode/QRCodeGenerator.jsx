import React, { useState } from 'react';
import { generateMenuQRCode } from '../../services/menu.service';

const GenerateQRCode = () => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateMenuQRCode();
      setQrCode(response.data.data.qrCode); // Asegúrate de usar correctamente la propiedad
    } catch (err) {
      setError('Error al generar el QR.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generar QR para Menú</h1>
      <button onClick={handleGenerateQR} disabled={loading}>
        {loading ? 'Generando...' : 'Generar QR'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '300px', height: '300px' }} />}
    </div>
  );
};

export default GenerateQRCode;
