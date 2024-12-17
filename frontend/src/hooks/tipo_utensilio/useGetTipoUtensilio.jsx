import { useState, useEffect } from 'react';
import { getTiposUtensilio } from '@services/utensilios.service';

const useGetTipoUtensilio = () => {
    const [tipoUtensilios, setTipoUtensilios] = useState([]);

    const fetchTipoUtensilio = async () => {
        try {
            const data = await getTiposUtensilio();
            console.log("fetch tipo utensilio")
            //for(let i = 0; i < data.length; i++) {
                //data[i].nombre_tipo_utensilio = data[i].nombre_tipo_utensilio.charAt(0).toUpperCase() + data[i].nombre_tipo_utensilio.slice(1);
            //}
            data.map((item) => {
                item.nombre_tipo_utensilio = 
                item.nombre_tipo_utensilio.charAt(0).toUpperCase() + 
                item.nombre_tipo_utensilio.slice(1);
            })
            setTipoUtensilios(data);
        } catch (error) {
            console.error('Error fetching tipo utensilios:', error);
        }
    };

    useEffect(() => {
        fetchTipoUtensilio();
    }, []);

    return { tipoUtensilios, fetchTipoUtensilio, setTipoUtensilios };
};

export default useGetTipoUtensilio;
