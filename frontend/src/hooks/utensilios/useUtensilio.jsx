import { useState, useEffect } from 'react';
import { getUtensilios } from '@services/utensilio.service.js';

const useGetUtensilios = () => {
    const [utensilios, setUtensilios] = useState([]);
    const fetchUtensilios = async () => {
        try {
            const response = await getUtensilios();
            console.log("response")
            console.log(response)
            let formattedData = response.map(utensilio => ({
                id_utensilio: utensilio.id_utensilio,
                cantidad_utensilio: utensilio.cantidad_utensilio,
                costo_utensilio: utensilio.costo_utensilio,
                pedido: utensilio.pedido,
                tipo_utensilio: utensilio.tipo_utensilio
            }));
            console.log("!data ingrediente")
            console.log(formattedData)
            let data = []
            for (let i = 0; i < formattedData.length; i++) {
                const item = formattedData[i];
                console.log("test")
                console.log(item.tipo_utensilio)
                if (item.tipo_utensilio) {
                    data.push(item)
                }
            }
            console.log("!data ingrediente revisado")
            console.log(data)
            setUtensilios(data);
        } catch (error) {
            console.error("Error: ", error);
        }
    };
    useEffect(() => {
        fetchUtensilios();
    }, []);

    return { utensilios, fetchUtensilios, setUtensilios };
};

export default useGetUtensilios;