// Hook for editing Ingrediente
import { updateIngrediente } from '@services/ingredientes.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useEditIngrediente = (setIngredientes) => {
  const handleEdit = async (updatedIngrediente) => {
    if (updatedIngrediente) {
      try {
        await updateIngrediente(updatedIngrediente);
        showSuccessAlert('Actualizado', 'El ingrediente ha sido actualizado correctamente.');
        setIngredientes((prevArray) => prevArray.map((ingrediente) => ingrediente.id === updatedIngrediente.id ? updatedIngrediente : ingrediente));
      } catch (error) {
        console.error('Error al actualizar el ingrediente:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el ingrediente.');
      }
    }
  };

  return { handleEdit };
};