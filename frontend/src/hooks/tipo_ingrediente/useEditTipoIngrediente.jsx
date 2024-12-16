import { useState } from 'react';
import { updateTipoIngrediente } from '@services/ingredientes.service'; // Servicio correspondiente
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditTipoIngrediente = (setTiposIngrediente,  fetchTiposIngrediente) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataTipoIngrediente, setDataTipoIngrediente] = useState([]);

    const handleClickUpdate = () => {
        if (dataTipoIngrediente.length > 0) {
            console.log('Seleccionado para actualizar:', dataTipoIngrediente[0]);
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedDataTipoIngrediente) => {
        if (updatedDataTipoIngrediente) {
            try {
                // Verificar que dataTipoIngrediente contiene datos válidos
                if (!dataTipoIngrediente[0]?.id_tipo_ingrediente) {
                    throw new Error("El tipo de ingrediente seleccionado no contiene un ID válido.");
                }
    
                const updatedTipoIngrediente = await updateTipoIngrediente(
                    updatedDataTipoIngrediente,
                    dataTipoIngrediente[0].id_tipo_ingrediente // Evitar acceder si no está definido
                );
    
                showSuccessAlert(
                    '¡Actualizado!',
                    'El tipo de ingrediente ha sido actualizado correctamente.'
                );
    
                setIsPopupOpen(false);
    
                // Actualiza el estado, validando que `updatedTipoIngrediente.data` exista
                if (updatedTipoIngrediente?.id_tipo_ingrediente) {
                    setTiposIngrediente((prev) =>
                        prev.map((tipo) =>
                            tipo.id_tipo_ingrediente === updatedTipoIngrediente.id_tipo_ingrediente
                                ? updatedTipoIngrediente
                                : tipo
                        )
                    );
                }
                await fetchTiposIngrediente(); // Actualizar lista de tipos de ingrediente
    
                setDataTipoIngrediente([]); // Resetear datos seleccionados
            } catch (error) {
                console.error('Error al actualizar el tipo de ingrediente:', error);
                showErrorAlert('Error', error.message || 'Ocurrió un error al actualizar el tipo de ingrediente.');
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
