import { useState, useCallback } from 'react';
import { createComanda, getMeseros } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCreateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [meseros, setMeseros] = useState([]);
  const [loadingMeseros, setLoadingMeseros] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeseros = useCallback(async () => {
    setLoadingMeseros(true);
    const token = cookies.get('jwt-auth');
    try {
      const response = await getMeseros(token);
      setMeseros(response.data || []);
    } catch (err) {
      setError(err);
      console.error('Error obteniendo los meseros:', err);
    } finally {
      setLoadingMeseros(false);
    }
  }, []);

  const create = async (comandaData) => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      const response = await createComanda(comandaData, token);
      return response;
    } catch (error) {
      console.error('Error creando la comanda:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { meseros, fetchMeseros, loadingMeseros, create, loading, error };
};

export default useCreateComanda;
