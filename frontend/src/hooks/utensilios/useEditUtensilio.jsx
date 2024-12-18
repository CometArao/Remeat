import { useState } from 'react';
import { updateUtensilio } from '@services/utensilio.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditUtensilio = (setUtensilios) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataUtensilio, setDataUtensilio] = useState([]);

    const handleClickUpdate = () => {
        if (dataUtensilio.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedUtensilio) => {
        if (updatedUtensilio) {
            try {
                const updatedData = await updateUtensilio(updatedUtensilio, dataUtensilio[0].id_utensilio);
                showSuccessAlert('¡Actualizado!', 'El utensilio ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                setUtensilios((prev) =>
                    prev.map((utensilio) =>
                        utensilio.id_utensilio === updatedData.id_utensilio ? updatedData : utensilio
                    )
                );
                setDataUtensilio([]);
            } catch (error) {
                console.error('Error al actualizar el utensilio:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el utensilio.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUtensilio,
        setDataUtensilio,
    };
};

export default useEditUtensilio;
