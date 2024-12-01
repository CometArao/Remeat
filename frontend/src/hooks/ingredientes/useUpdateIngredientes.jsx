// Hook for editing Ingrediente
import { updateIngrediente } from '@services/ingredientes.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { updateTipoIngrediente } from '../../services/ingredientes.service';

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
export const useEditTipoIngrediente = (setIngredientes) => {
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

const handleUpdate = async (tipoIngrediente) => {
  if (tipoIngrediente) {
    try {
      const updatedTipoIngrediente = await updateTipoIngrediente(tipoIngrediente, tipoIngrediente.id);
      showSuccessAlert('¡Actualizado!', 'El usuario ha sido actualizado correctamente.');
      setIsPopupOpen(false);
      const formattedUser = formatPostUpdate(updatedUser);

      setUsers(prevUsers => prevUsers.map(user => {
        console.log("Usuario actual:", user);
        if (user.id === formattedUser.id) {
          console.log("Reemplazando con:", formattedUser);
        }
        return user.email === formattedUser.email ? formattedUser : user;
      }));


      setDataUser([]);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el usuario.');
    }
  }
};
