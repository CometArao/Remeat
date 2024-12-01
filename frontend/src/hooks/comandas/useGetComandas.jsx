import { useState, useEffect, useCallback } from 'react';
import { getComandas } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useGetComandas = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComandas = useCallback(async () => {
    setLoading(true);
    const token = cookies.get('jwt-auth'); // Obtén el token desde las cookies
    try {
      const response = await getComandas(token); // Llama a la función que obtiene las comandas
      setComandas(response.data.data || []); // Ajusta para acceder a `data.data`
    } catch (err) {
      console.error('Error obteniendo las comandas:', err); // Maneja errores
      setError(err); // Guarda el error en el estado
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  }, []); // useCallback asegura que no se recree la función innecesariamente

  useEffect(() => {
    fetchComandas(); // Llama a la función para obtener las comandas al cargar el componente
  }, [fetchComandas]);

  // Retornamos el estado actual, el error y la función de refresco
  return { comandas, loading, error, refetch: fetchComandas };
};

export default useGetComandas;
