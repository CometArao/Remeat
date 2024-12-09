import { useState, useEffect } from 'react';
import { getTiposUtensilio } from '@services/utensilios.service';

const useGetTipoUtensilio = () => {
    const [tipoUtensilios, setTipoUtensilios] = useState([]);

    const fetchTipoUtensilio = async () => {
        try {
            const data = await getTiposUtensilio();
            setTipoUtensilios(data);
        } catch (error) {
            console.error('Error fetching tipo utensilios:', error);
        }
    };

    useEffect(() => {
        fetchTipoUtensilio();
    }, []);

    return { tipoUtensilios, fetchTipoUtensilio, setTipoUtensilios };
};

export default useGetTipoUtensilio;
