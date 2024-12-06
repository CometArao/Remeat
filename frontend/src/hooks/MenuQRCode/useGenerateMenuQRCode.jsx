import { useState } from 'react';
import apiClient from '../../services/root.service';
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
            const response = await apiClient.get('/menus/menu/qr', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const qrCodeFromBackend = response.data.data.qrCode;

            // Validar que no se duplique el prefijo
            if (!qrCodeFromBackend.startsWith('data:image/png;base64,')) {
                throw new Error('Formato de QR inválido.');
            }

            

            setQrCode(qrCodeFromBackend); // Asignar directamente sin modificar
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
