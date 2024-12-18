import { deleteUtensilio } from '@services/utensilio.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteUtensilio = (fetchUtensilios, setDataUtensilio) => {
    const handleDelete = async (selectedUtensilios) => {
        if (selectedUtensilios.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const id = selectedUtensilios[0]?.id_utensilio;
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    await deleteUtensilio(id);
                    showSuccessAlert('¡Eliminado!', 'El utensilio ha sido eliminado correctamente.');
                    await fetchUtensilios();
                    setDataUtensilio([]);
                }
            } catch (error) {
                console.error('Error al eliminar el utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al eliminar el utensilio.');
            }
        } else {
            showErrorAlert('Error', 'No se seleccionó ningún utensilio para eliminar.');
        }
    };

    return { handleDelete };
};

export default useDeleteUtensilio;
