import { useState, useCallback } from 'react';
import { addPlatilloToComanda, getComandas, getPlatillos } from '../../services/comanda.service'; // Servicio actualizado
import cookies from 'js-cookie';

const useAddPlatilloToComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comandas, setComandas] = useState([]);
  const [platillos, setPlatillos] = useState([]); // Platillos del menú del día

  // Obtener platillos del menú del día
  const fetchPlatillos = useCallback(async () => {
    setLoading(true);
    const token = cookies.get('jwt-auth');
    try {
      const response = await getPlatillos(token);
      setPlatillos(response.data || []);
      console.log('Platillos del menú del día:', response.data);
    } catch (err) {
      console.error('Error obteniendo los platillos del menú del día:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComandas = useCallback(async () => {
    setLoading(true);
    const token = cookies.get('jwt-auth');
    try {
      const response = await getComandas(token);
      setComandas(response.data|| []);
      console.log('Comandas:', response.data);
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

  return { 
    addPlatillo, 
    comandas, 
    platillos, 
    loading, 
    error, 
    refetchComandas: fetchComandas, 
    refetchPlatillos: fetchPlatillos 
  };
};

export default useAddPlatilloToComanda;
