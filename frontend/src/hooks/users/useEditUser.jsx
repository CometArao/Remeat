import { useState } from 'react';
import { updateUser } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditUser = (setUsers, fetchUsers) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const handleClickUpdate = () => {
    if (dataUser.length > 0) {
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedUserData) => {
    if (updatedUserData) {
      try {
        const allowedData = {
          nombre_usuario: updatedUserData.nombre_usuario,
          apellido_usuario: updatedUserData.apellido_usuario,
          correo_usuario: updatedUserData.correo_usuario,
          rol_usuario: updatedUserData.rol_usuario,
          id_horario_laboral: updatedUserData.id_horario_laboral,
        };
        await updateUser(allowedData, dataUser[0].id_usuario);
        showSuccessAlert('¡Actualizado!', 'El usuario ha sido actualizado correctamente.');

        // Recarga los datos desde el backend
        await fetchUsers();

        setIsPopupOpen(false);
        setDataUser([]);
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el usuario.');
      }
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser,
  };
};

export default useEditUser;
