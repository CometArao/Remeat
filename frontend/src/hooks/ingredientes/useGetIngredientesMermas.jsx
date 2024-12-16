import { useEffect, useState } from 'react';
import { getIngredietnesDetallado } from '@services/ingredientes.service';

const useGetIngredientesSinTiposNulos = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        const data = await getIngredietnesDetallado();
        console.log("fetch ingredientes como")
        console.log(data)
        setIngredientes(data);
    };
    useEffect(() => {
        fetchIngredientes();
    }, [])
    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientesSinTiposNulos