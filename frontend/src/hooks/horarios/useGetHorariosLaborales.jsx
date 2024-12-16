import { useState, useEffect } from 'react';
import { getHorariosLaborales } from '@services/horarios.service.js';
import { truncateToMinutes2 } from '../../../../backend/src/utils/dateUtils.js';

const useGetHorariosLaborales = () => {
    const [horariosLaborales, setHorariosLaborales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHorariosLaborales = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getHorariosLaborales();
            console.log(data);

            const formattedData = data.map((horario) => ({
                ...horario,
                horario_dia: horario.horario_dia.map((dia) => ({
                    ...dia,
                    hora_inicio: truncateToMinutes2(dia.hora_inicio),
                    hora_fin: truncateToMinutes2(dia.hora_fin),
                })),
            }));

            setHorariosLaborales(formattedData);
        } catch (err) {
            console.error('Error fetching horarios laborales:', err);
            setError(err.message || 'Error interno');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHorariosLaborales();
    }, []);

    return { horariosLaborales, fetchHorariosLaborales, loading, error };
};

export default useGetHorariosLaborales;
