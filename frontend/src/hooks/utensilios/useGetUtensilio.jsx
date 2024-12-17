import { useEffect, useState } from "react";
import { getUtensilios } from "@services/utensilios.service";

const useGetUtensilios = () => {
    const [utensilios, setUtensilios] = useState([]);

    const fetchUtensilios = async () => {
        try {
            const data = await getUtensilios();
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
