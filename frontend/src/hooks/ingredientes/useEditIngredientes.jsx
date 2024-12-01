import { useState } from 'react';
import { updateIngrediente } from '@services/ingredientes.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditIngrediente = (setIngredientes) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataIngrediente, setDataIngrediente] = useState([]);

    const handleClickUpdate = () => {
        if (dataIngrediente.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedIngrediente) => {
        if (updatedIngrediente) {
            try {
                const updatedData = await updateIngrediente(
                    updatedIngrediente,
                    dataIngrediente[0].id_ingrediente
                );

                showSuccessAlert('¡Actualizado!', 'El ingrediente ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                setIngredientes((prev) =>
                    prev.map((ingrediente) =>
                        ingrediente.id_ingrediente === updatedData.id_ingrediente
                            ? updatedData
                            : ingrediente
                    )
                );

                setDataIngrediente([]);
            } catch (error) {
                console.error('Error al actualizar el ingrediente:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el ingrediente.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataIngrediente,
        setDataIngrediente,
    };
};

export default useEditIngrediente;
