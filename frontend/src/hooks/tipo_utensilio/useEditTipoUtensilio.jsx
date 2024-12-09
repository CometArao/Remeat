import { useState } from 'react';
import { updateTipoUtensilio } from '@services/utensilios.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditTipoUtensilio = (setTipoUtensilios) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataTipoUtensilio, setDataTipoUtensilio] = useState([]);

    const handleClickUpdate = () => {
        if (dataTipoUtensilio.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataTipoUtensilio) => {
        if (updatedDataTipoUtensilio) {
            try {
                const updatedTipoUtensilio = await updateTipoUtensilio(
                    updatedDataTipoUtensilio,
                    dataTipoUtensilio[0].id_tipo_utensilio
                );

                showSuccessAlert('¡Actualizado!', 'El tipo de utensilio ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                setTipoUtensilios((prev) =>
                    prev.map((tipo) =>
                        tipo.id_tipo_utensilio === updatedTipoUtensilio.id_tipo_utensilio
                            ? updatedTipoUtensilio
                            : tipo
                    )
                );
                setDataTipoUtensilio([]);
            } catch (error) {
                console.error('Error al actualizar el tipo de utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el tipo de utensilio.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataTipoUtensilio,
        setDataTipoUtensilio,
    };
};

export default useEditTipoUtensilio;
