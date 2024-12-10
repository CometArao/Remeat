import { useEffect, useState } from 'react';
import { getIngredientes } from '@services/ingredientes.service';

const useGetIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        try {
            const data = await getIngredientes();
            if (Array.isArray(data)) {
                setIngredientes(data);
            } else {
                console.error("Error fetching ingredientes: ", data);
            }
        } catch (error) {
            console.error("Error fetching ingredientes:", error);
        }
    };

    useEffect(() => {
        fetchIngredientes();
    }, []);

    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientes;
