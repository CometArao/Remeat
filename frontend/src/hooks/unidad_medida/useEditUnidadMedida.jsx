import { useState } from 'react';
import { updateUnidadMedida } from '@services/unidad_medida.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditUnidadMedida = (setUnidadMedida) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataUnidadMedida, setDataUnidadMedida] = useState([]);

    const handleClickUpdate = () => {
        if (dataUnidadMedida.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedUnidadMedidaData) => {
        if (updatedUnidadMedidaData) {
            try {
                // Verifica que dataUnidadMedida[0] y su ID existan
                if (!dataUnidadMedida[0]?.id_unidad_medida) {
                    throw new Error("No se encontró un ID válido para la unidad de medida.");
                }
    
                const updatedUnidadMedida = await updateUnidadMedida(
                    updatedUnidadMedidaData,
                    dataUnidadMedida[0].id_unidad_medida
                );
    
                showSuccessAlert(
                    '¡Actualizada!',
                    'La unidad de medida ha sido actualizada correctamente.'
                );
    
                setIsPopupOpen(false);
    
                // Actualiza el estado
                setUnidadMedida((prev) =>
                    prev.map((unidad) =>
                        unidad.id_unidad_medida === updatedUnidadMedida.id_unidad_medida
                            ? updatedUnidadMedida
                            : unidad
                    )
                );
    
                setDataUnidadMedida([]);
            } catch (error) {
                console.error('Error al actualizar la unidad de medida:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un error al actualizar la unidad de medida.');
            }
        }
    };
    

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUnidadMedida,
        setDataUnidadMedida,
    };
};

export default useEditUnidadMedida;
