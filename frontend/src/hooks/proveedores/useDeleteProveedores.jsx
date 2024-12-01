import { deleteProveedor } from '@services/proveedores.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteProveedor = (fetchProveedores, setDataProveedor) => {
    const handleDelete = async (selectedProveedores) => {
        if (selectedProveedores.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    await deleteProveedor(selectedProveedores[0].id_proveedor);
                    showSuccessAlert('¡Proveedor Eliminado!', 'El proveedor ha sido eliminado correctamente.');
                    fetchProveedores(); // Actualiza la lista de proveedores
                    setDataProveedor([]);
                }
            } catch (error) {
                console.error('Error al eliminar el proveedor:', error);
                showErrorAlert('Error', 'Ocurrió un problema al eliminar el proveedor.');
            }
        }
    };

    return { handleDelete };
};

export default useDeleteProveedor;
