import { useState, useEffect } from 'react';
import { getUtensilios } from '@services/utensilio.service.js';

const useGetUtensilios = () => {
    const [utensilios, setUtensilios] = useState([]);
    const fetchUtensilios = async () => {
        try {
            const response = await getUtensilios();
            console.log("response")
            console.log(response)
            const formattedData = response.map(utensilio => ({
                id_utensilio: utensilio.id_utensilio,
                cantidad_utensilio: utensilio.cantidad_utensilio,
                pedido: utensilio.pedido,
                tipo_utensilio: utensilio.tipo_utensilio
            }));
            setUtensilios(formattedData);
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