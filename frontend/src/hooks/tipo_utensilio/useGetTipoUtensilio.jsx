import { useState, useEffect } from 'react';
import { getTiposUtensilio } from '@services/utensilio.service';

const useGetTipoUtensilio = () => {
    const [tipoUtensilios, setTipoUtensilio] = useState([]);
    const fetchTipoUtensilio = async () => {
        try {
            const response = await getTiposUtensilio();
            const formattedData = response.map(utensilio => ({
                id_tipo_utensilio: utensilio.id_tipo_utensilio,
                nombre_tipo_utensilio: utensilio.nombre_tipo_utensilio,
            }));
            setTipoUtensilio(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchTipoUtensilio();
    }, []);

    return { tipoUtensilios, fetchTipoUtensilio, setTipoUtensilio };
};

export default useGetTipoUtensilio;