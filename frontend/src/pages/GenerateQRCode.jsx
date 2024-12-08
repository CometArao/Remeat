import React from 'react';
import useGenerateMenuQRCode from '../hooks/MenuQRCode/useGenerateMenuQRCode';

const GenerateQRCode = () => {
    const { qrCode, generateQRCode, loading, error } = useGenerateMenuQRCode();

    return (
        <div>
            <h1>Generar QR para Menú</h1>
            <button onClick={() => generateQRCode()} disabled={loading}>
                {loading ? 'Generando...' : 'Generar QR'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {qrCode && (
                <div>
                    <h2>Código QR Generado:</h2>
                    <img 
                        src={qrCode.trim()}
                        alt="QR Code" 
                        style={{ width: '300px', height: '300px' }} 
                    />
                </div>
            )}
        </div>
    );
};

export default GenerateQRCode;
