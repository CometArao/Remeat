import { useState } from 'react';
import { createIngrediente } from '@services/ingredientes.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useCreateIngrediente = (setIngredientes) => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [dataIngrediente, setDataIngrediente] = useState([]);

  const handleClickCreate = () => {
    setIsCreatePopupOpen(true);
  };

  const handleCreate = async (newDataIngrediente) => {
    if (newDataIngrediente) {
      try {
        const createdIngrediente = await createIngrediente(newDataIngrediente);
        showSuccessAlert('Actualizado', 'El ingrediente ha sido creado correctamente.');
        setIsCreatePopupOpen(false);
        setIngredientes((prevArray) => [...prevArray, createdIngrediente.data]);
        setDataIngrediente([]);
      } catch (error) {
        console.error('Error al crear el ingrediente:', error);
        showErrorAlert('Cancelado', 'Ocurrió un error al crear el ingrediente.');
      }
    }
  };

  return {
    handleClickCreate,
    handleCreate,
    isCreatePopupOpen,
    setIsCreatePopupOpen,
    dataIngrediente,
    setDataIngrediente,
  };
};

export default useCreateIngrediente;
