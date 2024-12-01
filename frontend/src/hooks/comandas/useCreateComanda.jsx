import { useState, useCallback } from 'react';
import { createComanda, getComandas } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCreateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [comandas, setComandas] = useState([]);
  const [error, setError] = useState(null);

  const fetchComandas = useCallback(async () => {
    setLoading(true);
    const token = cookies.get('jwt-auth');
    try {
      const response = await getComandas(token);
      setComandas(response.data.data || []);
    } catch (err) {
      console.error('Error obteniendo las comandas después de crear:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (comandaData) => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      const response = await createComanda(comandaData, token);
      await fetchComandas(); // Actualiza la lista después de crear
      return response;
    } catch (error) {
      console.error('Error creando la comanda:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { create, comandas, loading, error, refetch: fetchComandas };
};

export default useCreateComanda;
