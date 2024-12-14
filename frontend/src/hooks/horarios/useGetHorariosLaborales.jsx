import { useState, useEffect } from 'react';
import { getHorariosLaborales } from '@services/horarios.service.js';

const useGetHorariosLaborales = () => {
    const [horariosLaborales, setHorariosLaborales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHorariosLaborales = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getHorariosLaborales();
            setHorariosLaborales(data);
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
