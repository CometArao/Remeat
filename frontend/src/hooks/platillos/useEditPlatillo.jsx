import { useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { updatePlatillo } from '@services/platillos.service.js';

const useEditPlatillo = (setPlatillo, fetchPlatillo) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPlatillo, setDataPlatillo] = useState([]);

    const handleClickUpdate = () => {
        if (dataPlatillo.length > 0) {
            console.log('Seleccionado para actualizar:', dataPlatillo[0]);
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataPlatillo) => {
        try {
            console.log(updatedDataPlatillo)
            const id = updatedDataPlatillo.id_platillo;

            if (!id) {
                throw new Error('ID no válido para el platillo seleccionado.');
            }

            const formattedData = {
                nombre_platillo: updatedDataPlatillo.nombre_platillo,
                ...(updatedDataPlatillo.disponible !== undefined && { disponible: updatedDataPlatillo.disponible }),
                ingredientes: updatedDataPlatillo.ingredientes,
            };

            console.log('Datos enviados:', formattedData);

            await updatePlatillo(formattedData, id);
              // Refresca la tabla
            await fetchPlatillo();
            // Muestra mensaje de éxito
            showSuccessAlert('¡Actualizado!', 'El platillo ha sido actualizado correctamente.');
            setIsPopupOpen(false);
            setDataPlatillo([]);

        } catch (error) {
            console.error('Error al actualizar el platillo:', error.message);
            showErrorAlert('Error', error.message || 'Ocurrió un error al actualizar el platillo.');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPlatillo,
        setDataPlatillo,
    };
};

export default useEditPlatillo;