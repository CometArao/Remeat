import { useState } from 'react';
import { confirmarPedidoService } from '@services/pedido.service';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useConfirmarPedido = (fetchPedidos) => {
    const [loading, setLoading] = useState(false);

    const handleConfirmarPedido = async (pedidoId) => {
        if (loading) return; // Evita llamadas repetidas mientras ya se está procesando
        try {
            setLoading(true); // Marca como cargando
            const response = await confirmarPedidoService(pedidoId);
            if (response.status === 'Success') {
                showSuccessAlert('Pedido confirmado', 'El pedido se ingresó correctamente.');
                fetchPedidos(); // Actualiza los pedidos después de confirmar
            } else {
                showErrorAlert('Error', response.message || 'No se pudo confirmar el pedido.');
            }
        } catch (error) {
            console.error('Error al confirmar el pedido:', error);
            showErrorAlert('Error', 'Ocurrió un error al confirmar el pedido.');
        } finally {
            setLoading(false); // Resetea el estado de carga
        }
    };

    return { handleConfirmarPedido, loading };
};

export default useConfirmarPedido;
