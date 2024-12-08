import { useEffect, useState } from 'react';
import { getIngredientes } from '@services/ingredientes.service';

const useGetIngredientesSinTiposNulos = () => {
    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        const data = await getIngredientes();
        console.log("fetch ingredientes")
        console.log(data)
        let checkedData = []
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.tipo_ingrediente) {
                checkedData.push(item)
            }
        }
        console.log("!data ingrediente revisado")
        console.log(checkedData)
        if (checkedData) {
            setIngredientes(checkedData);
        }
    };
    useEffect(() => {
        fetchIngredientes();
    }, [])
    return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngredientesSinTiposNulos