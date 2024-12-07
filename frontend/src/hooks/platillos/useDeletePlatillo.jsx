import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { deletePlatillo } from '../../services/platillos.service';

const useDeletePlatillo = (fetchPlatillo, setDataPlatillo) => {
  const handleDelete = async (selectedPlatillos) => {
    if (selectedPlatillos.length > 0) {
      try {
        const result = await deleteDataAlert(); // Confirmación del usuario
        if (result.isConfirmed) {
          const id = selectedPlatillos[0]?.id_platillo; // Obtener el ID del seleccionado
          if (!id) {
            showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
            return;
          }

          const response = await deletePlatillo(id); // Llama al servicio de eliminación

          if (response?.status === 'Client error') {
            throw new Error(response.details || 'Error desconocido al eliminar el platillo.');
          }

          showSuccessAlert('¡Eliminado!', 'El platillo ha sido eliminado correctamente.');
          await fetchPlatillo(); // Refresca los datos
          setDataPlatillo([]); // Limpia la selección
        }
      } catch (error) {
        console.error('Error al eliminar el platillo:', error);
        showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el platillo.');
      }
    } else {
      showErrorAlert('Error', 'No se seleccionó ningún platillo para eliminar.');
    }
  };

  return { handleDelete };
};

export default useDeletePlatillo;
