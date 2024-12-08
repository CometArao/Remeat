import { deletePedido } from '@services/pedido.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeletePedido = (fetchPedidos, setDataPedido) => {
    const handleDelete = async (selectedPedidos) => {
        if (selectedPedidos.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const id = selectedPedidos[0]?.id_pedido;
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    const response = await deletePedido(id);

                    if (response?.status === 'Client error') {
                        throw new Error(response.details || 'Error desconocido al eliminar el pedido.');
                    }

                    showSuccessAlert('¡Eliminado!', 'El pedido ha sido eliminado correctamente.');
                    await fetchPedidos();
                    setDataPedido([]);
                }
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el pedido.');
            }
        } else {
            showErrorAlert('Error', 'No se seleccionó ningún pedido para eliminar.');
        }
    };

    return { handleDelete };
};

export default useDeletePedido;