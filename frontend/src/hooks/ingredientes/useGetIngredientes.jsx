import { useEffect, useState } from 'react';
import { getIngredientes } from '@services/ingredientes.service';

const useGetIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        const data = await getIngredientes();
        console.log("fetch ingredientes")
        console.log(data)
        if (data) {
            setIngredientes(data);
        }
    };
    useEffect(() => {
        fetchIngredientes();
    }, [])
    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientes;
