import { useState } from 'react';
import { createUnidadMedida } from '@services/unidad_medida.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateUnidadMedida = (setUnidadMedida) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);
    const [dataUnidadMedida, setDataUnidadMedida] = useState([]);

    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true);
    };

    const handleCreate = async (newDataUnidadMedida) => {
        if (newDataUnidadMedida) {
            try {
                const createdUnidadMedida = await createUnidadMedida(newDataUnidadMedida);
                showSuccessAlert('¡Creada!', 'La unidad de medida ha sido creada correctamente.');
                setIsCreatePopUpOpen(false);
                setUnidadMedida((prevArray) => [...prevArray, createdUnidadMedida.data]);
                setDataUnidadMedida([]);
            } catch (error) {
                console.error('Error al crear la unidad de medida:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear la unidad de medida.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataUnidadMedida,
        setDataUnidadMedida,
    };
};

export default useCreateUnidadMedida;
