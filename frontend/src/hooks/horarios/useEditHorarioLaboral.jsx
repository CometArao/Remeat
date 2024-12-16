import { useState } from 'react';
import { updateHorarioLaboral } from '@services/horarios.service.js';
import { truncateToMinutes2 } from '../../../../backend/src/utils/dateUtils.js';

const useEditHorarioLaboral = (fetchHorariosLaborales) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);

    const handleClickUpdate = (horario) => {
        // Truncar horas en horario_dia antes de abrir el popup
        const formattedHorario = {
            ...horario,
            horario_dia: horario.horario_dia.map((dia) => ({
                ...dia,
                hora_inicio: truncateToMinutes2(dia.hora_inicio),
                hora_fin: truncateToMinutes2(dia.hora_fin),
            })),
        };

        setSelectedHorario(formattedHorario);
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
