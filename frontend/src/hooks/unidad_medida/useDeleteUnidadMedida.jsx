import { deleteUnidadMedida } from '@services/unidad_medida.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteUnidadMedida = (fetchUnidadMedida, setDataUnidadMedida) => {
    const handleDelete = async (dataUnidadMedida) => {
        if (dataUnidadMedida.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deleteUnidadMedida(dataUnidadMedida[0].id_unidad_medida);

                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }

                    showSuccessAlert(
                        '¡Eliminada!',
                        'La unidad de medida ha sido eliminada correctamente.'
                    );

                    await fetchUnidadMedida();
                    setDataUnidadMedida([]);
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar la unidad de medida:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un error al eliminar la unidad de medida.');
            }
        }
    };

    return {
        handleDelete,
    };
};

export default useDeleteUnidadMedida;
