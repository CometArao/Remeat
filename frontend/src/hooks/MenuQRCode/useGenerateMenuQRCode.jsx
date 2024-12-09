import { useState } from 'react';
import { generateMenuQRCode } from '../../services/MenuDiarioMenuQr.service';
import cookies from 'js-cookie';

const useGenerateMenuQRCode = () => {
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateQRCode = async () => {
        setLoading(true);
        setError(null);

        const token = cookies.get('jwt-auth'); 

        try {
            const response = await generateMenuQRCode(token);
            const qrCodeFromBackend = response.data.qrCode;

            
            if (!qrCodeFromBackend.startsWith('data:image/png;base64,')) {
                throw new Error('Formato de QR inválido.');
            }

            setQrCode(qrCodeFromBackend);
        } catch (err) {
            console.error('Error al generar el QR:', err);
            setError(err.response?.data?.message || 'Error al generar el QR.');
        } finally {
            setLoading(false);
        }
    };

    return { qrCode, generateQRCode, loading, error }; 
};

export default useGenerateMenuQRCode;
