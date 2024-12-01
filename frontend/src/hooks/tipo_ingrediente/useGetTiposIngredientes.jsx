import { useState, useEffect } from 'react';
import { getTiposIngrediente } from '@services/ingredientes.service.js';

const useGetTiposIngrediente = () => {
    const [tiposIngrediente, setTiposIngrediente] = useState([]);

    const fetchTiposIngrediente = async () => {
        try {
            const data = await getTiposIngrediente();
            setTiposIngrediente(data);
        } catch (error) {
            console.error('Error fetching tipos de ingrediente:', error);
        }
    };

    useEffect(() => {
        fetchTiposIngrediente();
    }, []);

    return { tiposIngrediente, fetchTiposIngrediente, setTiposIngrediente };
};

export default useGetTiposIngrediente;
