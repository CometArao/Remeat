import { useState, useEffect } from 'react';
import { getComandas } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useGetComandas = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComandas = async () => {
      setLoading(true);
      const token = cookies.get('jwt-auth'); // Obtén el token desde las cookies
      try {
        const response = await getComandas(token); // Llama a la función que obtiene las comandas
        console.log('Respuesta de la API:', response); // Verifica qué devuelve la API
        setComandas(response.data.data || []); // Ajusta para acceder a `data.data`
      } catch (err) {
        console.error('Error obteniendo las comandas:', err); // Maneja errores
        setError(err); // Guarda el error en el estado
      } finally {
        setLoading(false); // Desactiva el estado de carga
      }
    };
  
    fetchComandas(); // Llama a la función para obtener las comandas
  }, []);
  

  return { comandas, loading, error };
};

export default useGetComandas;
