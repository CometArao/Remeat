import { useState } from 'react';
import { updateTipoIngrediente } from '@services/ingredientes.service'; // Servicio correspondiente
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditTipoIngrediente = (setTiposIngrediente) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataTipoIngrediente, setDataTipoIngrediente] = useState([]);

    const handleClickUpdate = () => {
        if (dataTipoIngrediente.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataTipoIngrediente) => {
        if (updatedDataTipoIngrediente) {
            try {
                const updatedTipoIngrediente = await updateTipoIngrediente(
                    updatedDataTipoIngrediente,
                    dataTipoIngrediente[0].id_tipo_ingrediente
                );

                showSuccessAlert(
                    '¡Actualizado!',
                    'El tipo de ingrediente ha sido actualizado correctamente.'
                );

                setIsPopupOpen(false);

                // Actualiza el estado
                setTiposIngrediente((prev) =>
                    prev.map((tipo) =>
                        tipo.id_tipo_ingrediente === updatedTipoIngrediente.data.id_tipo_ingrediente
                            ? updatedTipoIngrediente.data
                            : tipo
                    )
                );

                setDataTipoIngrediente([]);
            } catch (error) {
                console.error('Error al actualizar el tipo de ingrediente:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el tipo de ingrediente.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataTipoIngrediente,
        setDataTipoIngrediente,
    };
};

export default useEditTipoIngrediente;
