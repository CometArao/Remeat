import { useState } from 'react';
import { updateTipoUtensilio } from '../../services/utensilio.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdate } from '@helpers/formatData.js';

const useEditTipoUtensilio = (setTipoUtensilio, fetchTipoUtensilio) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataTipoUtensilio, setDataTipoUtensilio] = useState([]);
    
    //Funcion que se ejecuta al presionar el boton editar
    const handleClickUpdate = () => {
        if (dataTipoUtensilio.length > 0) {
            setIsPopupOpen(true);
        }
    };

    //Funcion que se ejecuta al confirmar el formulario de edicion
    const handleUpdate = async (updatedTipoUtensilioData) => {
        if (updatedTipoUtensilioData) {
            try {
            console.log("dataTipoUtensilio")
            console.log(dataTipoUtensilio)
            const updatedTipoUtensilio = await updateTipoUtensilio(updatedTipoUtensilioData, dataTipoUtensilio[0].id_tipo_utensilio);
            showSuccessAlert('¡Actualizado!','El tipo de utensilio ha sido actualizado correctamente.');

            setIsPopupOpen(false);

            await fetchTipoUtensilio();
            setIsPopupOpen(false);
            setDataTipoUtensilio([]);
            } catch (error) {
                console.error('Error al actualizar el Tipo Utensilio:', error);
                showErrorAlert('Cancelado','Ocurrió un error al actualizar el Tipo Utensilio.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataTipoUtensilio,
        setDataTipoUtensilio
    };
};

export default useEditTipoUtensilio;