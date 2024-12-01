import { useState, useEffect } from 'react';
import { getComandasWithPlatillos } from '../../services/comanda.service';

const useGetComandasWithPlatillos = () => {
  const [comandasWithPlatillos, setComandasWithPlatillos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComandasWithPlatillos = async () => {
      setLoading(true);
      try {
        const response = await getComandasWithPlatillos();
        setComandasWithPlatillos(response.data || []);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComandasWithPlatillos();
  }, []);

  return { comandasWithPlatillos, loading, error };
};

export default useGetComandasWithPlatillos;
