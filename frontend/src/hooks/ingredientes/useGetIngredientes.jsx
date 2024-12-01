import { useState, useEffect } from 'react';
import { getIngredientes } from '@services/ingredientes.service.js';

const useGetIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        try {
            const data = await getIngredientes();
            setIngredientes(data);
        } catch (error) {
            console.error('Error fetching ingredientes:', error);
        }
    };

    useEffect(() => {
        fetchIngredientes();
    }, []);

    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientes;
