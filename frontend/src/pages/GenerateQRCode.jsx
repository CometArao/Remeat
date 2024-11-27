import React from 'react';
import QRCodeGenerator from '../components/MenuQRCode/QRCodeGenerator';
import useGenerateMenuQRCode from '../hooks/menuQRCode/useGenerateMenuQRCode';

const GenerateQRCode = () => {
  const { qrCode, generateQRCode, loading } = useGenerateMenuQRCode();

  return (
    <div>
      <h1>Generar QR para Menú</h1>
      <QRCodeGenerator onGenerate={generateQRCode} />
      {loading && <p>Generando código QR...</p>}
      {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
    </div>
  );
};

export default GenerateQRCode;
