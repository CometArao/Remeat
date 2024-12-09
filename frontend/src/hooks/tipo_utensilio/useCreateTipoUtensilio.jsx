import { useState } from 'react';
import { createTipoUtensilio } from '@services/utensilios.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateTipoUtensilio = (setTipoUtensilios) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);
    const [dataTipoUtensilio, setDataTipoUtensilio] = useState([]);

    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true);
    };

    const handleCreate = async (newDataTipoUtensilio) => {
        if (newDataTipoUtensilio) {
            try {
                const createdTipoUtensilio = await createTipoUtensilio(newDataTipoUtensilio);
                showSuccessAlert('¡Creado!', 'El tipo de utensilio ha sido creado correctamente.');
                setIsCreatePopUpOpen(false);
                setTipoUtensilios((prevArray) => [...prevArray, createdTipoUtensilio.data]);
                setDataTipoUtensilio([]);
            } catch (error) {
                console.error('Error al crear el tipo de utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear el tipo de utensilio.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataTipoUtensilio,
        setDataTipoUtensilio,
    };
};

export default useCreateTipoUtensilio;
