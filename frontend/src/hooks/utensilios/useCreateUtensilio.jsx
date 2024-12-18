import { useState } from 'react';
import { createUtensilio } from '@services/utensilio.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateUtensilio = (setUtensilios) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataUtensilio, setDataUtensilio] = useState([]);

    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    const handleCreate = async (newDataUtensilio) => {
        if (newDataUtensilio) {
            try {
                //Elimina campos vacíos o nulos antes de enviar
                const cleanedData = Object.fromEntries(
                    Object.entries(newDataUtensilio).filter(([_, v]) => v != null && v !== '')
                );

                const createdUtensilio = await createUtensilio(cleanedData);
                showSuccessAlert('¡Creado!', 'El utensilio ha sido creado correctamente.');
                setIsCreatePopupOpen(false);
                setUtensilios((prevArray) => [...prevArray, createdUtensilio]);
                setDataUtensilio([]);
            } catch (error) {
                console.error('Error al crear el utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear el utensilio.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataUtensilio,
        setDataUtensilio,
    };
};

export default useCreateUtensilio;
