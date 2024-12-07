import { useState, useEffect } from 'react';
import { getPlatillos } from '@services/platillos.service.js';

const useGetPlatillos = () => {
    const [platillo, setPlatillo] = useState([]);

    const fetchPlatillo = async () => {
        try {
            const data = await getPlatillos();
            setPlatillo(data);
        } catch (error) {
            console.error('Error fetching platillos:', error);
        }
    };

    useEffect(() => {
        fetchPlatillo();
    }, []);

    return { platillo, fetchPlatillo, setPlatillo };
};

export default useGetPlatillos;
