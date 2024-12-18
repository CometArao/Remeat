import { deleteTipoUtensilio } from '@services/utensilio.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteTipoUtensilio = (fetchTipoUtensilios, setDataTipoUtensilio) => {
    const handleDelete = async (selectedTiposUtensilio) => {
        if (selectedTiposUtensilio.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const id = selectedTiposUtensilio[0]?.id_tipo_utensilio;
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    await deleteTipoUtensilio(id);
                    showSuccessAlert('¡Eliminado!', 'El tipo de utensilio ha sido eliminado correctamente.');
                    await fetchTipoUtensilios();
                    setDataTipoUtensilio([]);
                }
            } catch (error) {
                console.error('Error al eliminar el tipo de utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al eliminar el tipo de utensilio.');
            }
        } else {
            showErrorAlert('Error', 'No se seleccionó ningún tipo de utensilio para eliminar.');
        }
    };

    return { handleDelete };
};

export default useDeleteTipoUtensilio;
