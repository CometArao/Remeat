import { deleteUser } from '@services/user.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteUser = (fetchUsers, setDataUser) => {
    const handleDelete = async (dataUser) => {
        if (dataUser.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    // Enviar id_usuario al backend
                    const response = await deleteUser(dataUser[0].id_usuario); 
                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!', 'El usuario ha sido eliminado correctamente.');
                    fetchUsers(); // Actualizar lista de usuarios
                    setDataUser([]); // Limpiar selección
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                showErrorAlert('Error', 'No se pudo eliminar el usuario.');
            }
        }
    };

    return { handleDelete };
};

export default useDeleteUser;
