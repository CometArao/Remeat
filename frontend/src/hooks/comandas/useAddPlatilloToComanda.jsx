import { useState, useCallback } from 'react';
import { addPlatilloToComanda, getComandas } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useAddPlatilloToComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comandas, setComandas] = useState([]);

  const fetchComandas = useCallback(async () => {
    setLoading(true);
    const token = cookies.get('jwt-auth');
    try {
      const response = await getComandas(token);
      setComandas(response.data.data || []);
    } catch (err) {
      console.error('Error obteniendo las comandas después de añadir platillo:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlatillo = async (comandaId, platilloData) => {
    setLoading(true);
    setError(null);
    try {
      const token = cookies.get('jwt-auth');
      await addPlatilloToComanda(comandaId, platilloData, token);
      await fetchComandas(); // Actualiza la lista después de añadir un platillo
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { addPlatillo, comandas, loading, error, refetch: fetchComandas };
};

export default useAddPlatilloToComanda;
