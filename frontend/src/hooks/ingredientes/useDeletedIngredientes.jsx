// Hook for deleting Ingrediente
import { deleteIngrediente } from '@services/ingredientes.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useDeleteIngrediente = (setIngredientes) => {
  const handleDelete = async (ingredienteId) => {
    if (ingredienteId) {
      try {
        await deleteIngrediente(ingredienteId);
        showSuccessAlert('Eliminado', 'El ingrediente ha sido eliminado correctamente.');
        setIngredientes((prevArray) => prevArray.filter((ingrediente) => ingrediente.id !== ingredienteId));
      } catch (error) {
        console.error('Error al eliminar el ingrediente:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el ingrediente.');
      }
    }
  };

  return { handleDelete };
};