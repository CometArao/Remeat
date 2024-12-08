import { useState, useEffect } from 'react';
import  {getPlatillos}  from '@services/platillos.service.js';

const useGetPlatillos = () => {
     
    const [platillo, setPlatillo] = useState([]);
    console.log('Estado platillo:', platillo);

    const fetchPlatillo = async () => {
        try {
            const data = await getPlatillos();
            console.log('Data retornada por getPlatillos:', data);
            setPlatillo(data);
            console.log('Estado platillo despues de setPlatillo:', platillo);
          } catch (error) {
            console.error('Error fetching platillos:', error);
          }
        };

    useEffect(() => {
        fetchPlatillo();
    }, []);

    return { platillo, fetchPlatillo, setPlatillo };
}
export default useGetPlatillos;
