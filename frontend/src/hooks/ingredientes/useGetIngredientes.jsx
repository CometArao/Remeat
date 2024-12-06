import { useState } from 'react';
import { getIngredientes } from '@services/ingredientes.service';

const useGetIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        const data = await getIngredientes();
        if (data) {
            setIngredientes(data);
        }
    };

    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientes;
