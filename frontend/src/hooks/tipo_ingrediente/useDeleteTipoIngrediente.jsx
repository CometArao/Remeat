import { deleteTipoIngrediente } from '@services/ingredientes.service'; // Servicio correspondiente
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteTipoIngrediente = (fetchTiposIngrediente, setDataTipoIngrediente) => {
    const handleDelete = async (dataTipoIngrediente) => {
        if (dataTipoIngrediente.length > 0) {
            try {
                const response = await deleteTipoIngrediente(dataTipoIngrediente[0].id_tipo_ingrediente);

                if (response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }

                showSuccessAlert(
                    '¡Eliminado!',
                    'El tipo de ingrediente ha sido eliminado correctamente.'
                );

                // Refresca los datos
                await fetchTiposIngrediente();
                setDataTipoIngrediente([]);
            } catch (error) {
                console.error('Error al eliminar el tipo de ingrediente:', error);
                showErrorAlert('Error', 'Ocurrió un error al eliminar el tipo de ingrediente.');
            }
        }
    };

    return { handleDelete };
};

export default useDeleteTipoIngrediente;
