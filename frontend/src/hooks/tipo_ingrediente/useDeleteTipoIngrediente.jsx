import { deleteTipoIngrediente } from '@services/ingredientes.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteTipoIngrediente = (fetchTiposIngrediente, setDataTipoIngrediente) => {
  const handleDelete = async (selectedTiposIngrediente) => {
    if (selectedTiposIngrediente.length > 0) {
      try {
        const result = await deleteDataAlert(); // Confirmación del usuario
        if (result.isConfirmed) {
          const id = selectedTiposIngrediente[0]?.id_tipo_ingrediente; // Obtener el ID del seleccionado
          if (!id) {
            showErrorAlert('Error', 'No se pudo determinar el ID para eliminar.');
            return;
          }

          const response = await deleteTipoIngrediente(id); // Llama al servicio de eliminación

          if (response?.status === 'Client error') {
            throw new Error(response.details || 'Error desconocido al eliminar el tipo de ingrediente.');
          }

          showSuccessAlert('¡Eliminado!', 'El tipo de ingrediente ha sido eliminado correctamente.');
          await fetchTiposIngrediente(); // Refresca los datos
          setDataTipoIngrediente([]); // Limpia la selección
        }
      } catch (error) {
        console.error('Error al eliminar el tipo de ingrediente:', error);
        showErrorAlert('Error', error.message || 'Ocurrió un problema al eliminar el tipo de ingrediente.');
      }
    } else {
      showErrorAlert('Error', 'No se seleccionó ningún tipo de ingrediente para eliminar.');
    }
  };

  return { handleDelete };
};

export default useDeleteTipoIngrediente;
