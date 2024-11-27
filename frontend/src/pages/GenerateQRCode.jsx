import React from 'react';
import useGenerateMenuQRCode from '../hooks/MenuQRCode/useGenerateMenuQRCode';

const GenerateQRCode = () => {
  const { qrCode, generateQRCode, loading, error } = useGenerateMenuQRCode();

  return (
    <div>
      <h1>Generar QR para Menú</h1>
      {/* Botón para generar el QR */}
      <button onClick={() => generateQRCode()} disabled={loading}>
        {loading ? 'Generando...' : 'Generar QR'}
      </button>

      {/* Muestra el estado de error */}
      {error && <p style={{ color: 'red' }}>Error: {error.message || 'Ocurrió un error al generar el QR.'}</p>}

      {/* Muestra el código QR si está disponible */}
      {qrCode && (
        <div>
          <h2>Código QR Generado:</h2>
          <img src={qrCode} alt="QR Code" style={{ width: '300px', height: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default GenerateQRCode;
