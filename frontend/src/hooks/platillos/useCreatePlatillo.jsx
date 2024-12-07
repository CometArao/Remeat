import { useState } from 'react';
import { createPlatillo } from '@services/platillos.service'; // Asegúrate de que este servicio exista
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreatePlatillo = (setPlatillo) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataPlatillo, setDataPlatillo] = useState([]); // Para almacenar datos temporales del formulario

    // Abre el popup de creación
    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    // Lógica para crear un nuevo tipo de ingrediente
    const handleCreate = async (newDataPlatillo) => {
        if (newDataPlatillo) {
            try {
                const createdPlatillo = await createPlatillo(newDataPlatillo);
                showSuccessAlert('¡Creado!', 'El platillo ha sido creado correctamente.');
                setIsCreatePopupOpen(false);
                // Actualiza el estado de la lista de tipos de ingrediente
                setPlatillo((prevArray) => [...prevArray, createdPlatillo.data]);
                setDataPlatillo([]); // Limpia los datos temporales
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
        dataPlatillo,
        setDataPlatillo,
    };
};

export default useCreatePlatillo;
