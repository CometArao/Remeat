import {deleteDataAlert, showErrorAlert, showSuccessAlert} from '@helpers/sweetAlert.js';
import {deleteMenu} from '../../services/menu.service.js';

const useDeleteMenu = (fetchMenus, setMenus) => {
    const handleDelete = async (selectedMenus) => {
        if (selectedMenus.length > 0) {
            try {
                const result = await deleteDataAlert(); // Confirmación del usuario
                if (result.isConfirmed) {
                    const id = selectedMenus[0]?.id_menu; // Obtener el ID del seleccionado

                    console.log('id:', id);
                    
                    if (!id) {
                        showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
                        return;
                    }

                    const response = await deleteMenu(id); // Llama al servicio de elimin
                    if (response?.status === 'Client error') {
                        throw new Error(response.details || 'Error desconocido al eliminar el menú.');
                    }

                    showSuccessAlert('¡Eliminado!', 'El menú ha sido eliminado correctamente.');
                    await fetchMenus(); // Refresca los datos
                    setMenus([]); // Limpia la selección
                }
            } catch (error) {
                console.error('Error al eliminar el menú:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el menú.');
            }
        }
        else {
            showErrorAlert('Error', 'No se seleccionó ningún menú para eliminar.');
        }
    };
    return {handleDelete};
}
export default useDeleteMenu;
