import { deletePedido } from '@services/pedido.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePedido = (fetchPedidos, setDataPedido) => {
    const handleDelete = async (selectedPedidos) => {
        if (selectedPedidos.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deletePedido(selectedPedidos[0].id_pedido);

                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.message);
                    }

                    showSuccessAlert(
                        '¡Eliminado!', 
                        'El pedido ha sido eliminado correctamente.'
                    );
                    await fetchPedidos();
                    setDataPedido([]);
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el pedido.');
            }
        }
    };

    return { handleDelete };
};

export default useDeletePedido;