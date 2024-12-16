import { useEffect, useState } from "react";
import { getUtensiliosDetallado } from "@services/utensilio.service";

const useGetUtensilios = () => {
    const [utensilios, setUtensilios] = useState([]);

    const fetchUtensilios = async () => {
        try {
            const data = await getUtensiliosDetallado();
            console.log("fetchUtensilios")
            console.log(data)
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
