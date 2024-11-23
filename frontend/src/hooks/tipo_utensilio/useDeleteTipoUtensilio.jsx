import { deleteTipoUtensilio } from '@services/utensilio.service.js'
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteTipoUtensilio = (fetchUsers, setDataUser) => {
    const handleDelete = async (dataUser) => {
        if (dataUser.length > 0) {
            try {
                const result = await deleteDataAlert();
            if (result.isConfirmed) {
                const response = await deleteTipoUtensilio(dataUser[0].id_tipo_utensilio);
                if(response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }
                showSuccessAlert('¡Eliminado!','El Tipo Utensilio ha sido eliminado correctamente.');
                await fetchUsers();
                setDataUser([]);
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el usuario.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteTipoUtensilio;