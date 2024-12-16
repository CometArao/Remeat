import { useState, useEffect } from 'react';
import { createComanda } from '../../services/comanda.service';
import { getPlatillos } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCreateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [platillos, setPlatillos] = useState([]);
  const [loadingPlatillos, setLoadingPlatillos] = useState(false);
  const [errorPlatillos, setErrorPlatillos] = useState(null);

  const fetchPlatillos = async () => {
    setLoadingPlatillos(true);
    try {
      const response = await getPlatillos();
      setPlatillos(response.data || []);
    } catch (error) {
      console.error('Error fetching platillos:', error);
      setErrorPlatillos(error);
    } finally {
      setLoadingPlatillos(false);
    }
  };

  const create = async (data) => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      const response = await createComanda(data, token);
      if (response.status !== 201) {
        throw new Error('Error al crear la comanda.');
      }
      return response;
    } catch (error) {
      console.error('Error en useCreateComanda:', error);
      setError(error.message || 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPlatillos();
  }, []);

  return { create, loading, error, platillos, loadingPlatillos, errorPlatillos };
};


export default useCreateComanda;
