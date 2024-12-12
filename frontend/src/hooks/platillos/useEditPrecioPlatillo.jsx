import { useState } from 'react';
import { updatePlatilloPrice } from '@services/platillos.service'; // Asegúrate de que este servicio exista
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPrecioPlatillo = (fetchPlatillo) => {
    const [isEditPricePopupOpen, setIsEditPricePopupOpen] = useState(false);
    const [selectedPlatillo, setSelectedPlatillo] = useState(null); // Para almacenar el platillo seleccionado

    // Abre el popup de edición de precio
    const handleClickEditPrice = (platillo) => {
        setSelectedPlatillo(platillo); // Establece el platillo seleccionado
        setIsEditPricePopupOpen(true);
    };

    // Lógica para actualizar el precio del platillo
    const handleUpdatePrice = async (newPrice) => {
        if (selectedPlatillo && newPrice) {
            try {
                await updatePlatilloPrice(selectedPlatillo.id_platillo, newPrice);
                showSuccessAlert('¡Actualizado!', 'El precio del platillo ha sido actualizado correctamente.');
                setIsEditPricePopupOpen(false);

                // Llama al fetch para actualizar la lista de platillos desde el servidor
                await fetchPlatillo();

                setSelectedPlatillo(null); // Limpia la selección del platillo
            } catch (error) {
                console.error('Error al actualizar el precio del platillo:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el precio del platillo.');
            }
        }
    };

    return {
        handleClickEditPrice,
        handleUpdatePrice,
        isEditPricePopupOpen,
        setIsEditPricePopupOpen,
        selectedPlatillo,
    };
};

export default useEditPrecioPlatillo;
