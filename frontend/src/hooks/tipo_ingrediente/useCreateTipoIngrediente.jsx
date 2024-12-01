import { useState } from 'react';
import { createTipoIngrediente } from '@services/ingredientes.service'; // Asegúrate de que este servicio exista
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateTipoIngrediente = (setTiposIngrediente) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataTipoIngrediente, setDataTipoIngrediente] = useState([]); // Para almacenar datos temporales del formulario

    // Abre el popup de creación
    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    // Lógica para crear un nuevo tipo de ingrediente
    const handleCreate = async (newDataTipoIngrediente) => {
        if (newDataTipoIngrediente) {
            try {
                const createdTipoIngrediente = await createTipoIngrediente(newDataTipoIngrediente);
                showSuccessAlert('¡Creado!', 'El tipo de ingrediente ha sido creado correctamente.');
                setIsCreatePopupOpen(false);
                // Actualiza el estado de la lista de tipos de ingrediente
                setTiposIngrediente((prevArray) => [...prevArray, createdTipoIngrediente.data]);
                setDataTipoIngrediente([]); // Limpia los datos temporales
            } catch (error) {
                console.error('Error al crear el tipo de ingrediente:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear el tipo de ingrediente.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataTipoIngrediente,
        setDataTipoIngrediente,
    };
};

export default useCreateTipoIngrediente;
