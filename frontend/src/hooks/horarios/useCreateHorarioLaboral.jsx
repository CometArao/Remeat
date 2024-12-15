import { createHorarioLaboral } from '@services/horarios.service.js';

const useCreateHorarioLaboral = (fetchHorariosLaborales) => {
    const handleCreate = async (horarioLaboral) => {
        try {
            await createHorarioLaboral(horarioLaboral);
            fetchHorariosLaborales(); // Refresca los datos tras crear
        } catch (error) {
            console.error('Error creando horario laboral:', error);
            throw error; // Permite capturar el error en el componente
        }
    };

    return { handleCreate };
};

export default useCreateHorarioLaboral;
