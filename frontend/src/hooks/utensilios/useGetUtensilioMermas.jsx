import { useEffect, useState } from "react";
import { getUtensilios } from "@services/utensilios.service";

const useGetUtensilios = () => {
    const [utensilios, setUtensilios] = useState([]);

    const fetchUtensilios = async () => {
        try {
            const data = await getUtensilios();
            console.log("data")
            console.log(data)
            for(let i = 0; i < data.length; i++) {
                const utensilio = data[i];
                if(utensilio.pedido.length != 1) {

                }
            }
            if (Array.isArray(data)) {
                setUtensilios(data);
            } else {
                console.error("Error fetching utensilios: ", data);
            }
        } catch (error) {
            console.error("Error fetching utensilios:", error);
        }
    };

    useEffect(() => {
        fetchUtensilios();
    }, []);

    return { utensilios, fetchUtensilios, setUtensilios };
};

export default useGetUtensilios;
