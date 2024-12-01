import { deleteIngrediente } from '@services/ingredientes.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteIngrediente = (fetchIngredientes, setDataIngrediente) => {
    const handleDelete = async (selectedIngredientes) => {
        if (selectedIngredientes.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const id = selectedIngredientes[0]?.id_ingrediente;
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    const response = await deleteIngrediente(id);

                    if (response?.status === 'Client error') {
                        throw new Error(response.details || 'Error desconocido al eliminar el ingrediente.');
                    }

                    showSuccessAlert('¡Eliminado!', 'El ingrediente ha sido eliminado correctamente.');
                    await fetchIngredientes();
                    setDataIngrediente([]);
                }
            } catch (error) {
                console.error('Error al eliminar el ingrediente:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el ingrediente.');
            }
        } else {
            showErrorAlert('Error', 'No se seleccionó ningún ingrediente para eliminar.');
        }
    };

    return { handleDelete };
};

export default useDeleteIngrediente;
