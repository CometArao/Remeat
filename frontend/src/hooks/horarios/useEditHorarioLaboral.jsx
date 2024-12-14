import { useState } from 'react';
import { updateHorarioLaboral } from '@services/horarios.service.js';

const useEditHorarioLaboral = (fetchHorariosLaborales) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);

    const handleClickUpdate = (horario) => {
        setSelectedHorario(horario);
        setIsPopupOpen(true);
    };

    const handleUpdate = async (horarioLaboral) => {
        try {
            await updateHorarioLaboral(horarioLaboral, selectedHorario.id_horario_laboral);
            fetchHorariosLaborales(); // Refresca los datos tras actualizar
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error actualizando horario laboral:', error);
        }
    };

    return { handleClickUpdate, handleUpdate, isPopupOpen, setIsPopupOpen };
};

export default useEditHorarioLaboral;
