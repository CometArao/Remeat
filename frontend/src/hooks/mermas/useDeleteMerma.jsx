import { deleteMerma } from '@services/merma.service.js'
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteMerma = (fetchMerma, setDataMerma) => {
    const handleDelete = async (dataMerma) => {
        console.log("handle delete")
        if (dataMerma.length > 0) {
            try {
                const result = await deleteDataAlert();
            if (result.isConfirmed) {
                const response = await deleteMerma(dataMerma[0].id_merma);
                if(response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }
                showSuccessAlert('¡Eliminado!','El  ha sido eliminado correctamente.');
                await fetchMerma();
                setDataMerma([]);
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
            } catch (error) {
                console.error('Error al eliminar la merma:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar la merma.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteMerma;