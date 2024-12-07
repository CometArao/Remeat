import { useState } from 'react';
import { updatePlatillo } from '@services/platillos.service'; // Servicio correspondiente
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPlatillo = (setPlatillo) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPlatillo, setDataPlatillo] = useState([]);

    const handleClickUpdate = () => {
        if (dataPlatillo.length > 0) {
            console.log('Seleccionado para actualizar:', dataPlatillo[0]);
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataPlatillo) => {
        if (updatedDataPlatillo) {
            try {
                // Verificar que dataTipoIngrediente contiene datos válidos
                if (!dataPlatillo[0]?.id_platillo) {
                    throw new Error("El platillo seleccionado no contiene un ID válido.");
                }
    
                const updatedPlatillo = await updatePlatillo(
                    updatedDataPlatillo,
                    dataPlatillo[0].id_platillo // Evitar acceder si no está definido
                );
    
                showSuccessAlert(
                    '¡Actualizado!',
                    'El tipo de ingrediente ha sido actualizado correctamente.'
                );
    
                setIsPopupOpen(false);
    
                // Actualiza el estado, validando que `updatedTipoIngrediente.data` exista
                if (updatedPlatillo?.id_platillo) {
                    setPlatillo((prev) =>
                        prev.map((platillo) =>
                            platillo.id_platillo === updatedPlatillo.id_platillo
                                ? updatedPlatillo
                                : platillo
                        )
                    );
                }
    
                setDataPlatillo([]); // Resetear datos seleccionados
            } catch (error) {
                console.error('Error al actualizar el platillo:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un error al actualizar el platillo.');
            }
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
