import { deleteIngrediente } from '@services/ingredientes.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteIngrediente = (fetchIngredientes, setDataIngrediente) => {
    const handleDelete = async (selectedIngredientes) => {
        if (selectedIngredientes.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    // Verificar que el usuario seleccionó exactamente un ingrediente
                    if (selectedIngredientes.length !== 1) {
                        showErrorAlert('Error', 'Debe seleccionar un único ingrediente para eliminar.');
                        return;
                    }

                    // Obtener el ID del ingrediente seleccionado
                    const id_ingrediente = selectedIngredientes[0]?.id_ingrediente;
                    if (!id_ingrediente) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    console.log("Voy al servicio del front")
                    // Enviar el ID al servicio de eliminación
                    const response = await deleteIngrediente(id_ingrediente);

                    if (response?.status === 'Client error') {
                        throw new Error(response.details || 'Error desconocido al eliminar el ingrediente.');
                    }

                    showSuccessAlert('¡Eliminado!', 'El ingrediente ha sido eliminado correctamente.');
                    await fetchIngredientes(); // Actualizar la lista de ingredientes
                    setDataIngrediente([]); // Limpiar la selección
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
