
import { useState, useEffect } from 'react';
import { getmermas } from '@services/merma.service.js';

const useMermas = () => {
    const [mermas, setMermas] = useState([]);
    const fetchMermas = async () => {
        try {
            const response = await getmermas();
            console.log("response")
            console.log(response)
            const formattedData = response.map(merma => ({
                id_merma: merma.id_merma,
                fecha_merma: merma.fecha_merma,
            }));
            console.log(formattedData)
            setMermas(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchMermas();
    }, []);
    console.log("mermas")
    console.log(mermas)
    return { mermas, fetchMermas, setMermas };
};

export default useMermas;