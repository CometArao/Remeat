import { useState, useEffect } from 'react';
import { getComandasWithPlatillos } from '../../services/comanda.service';
import cookies from 'js-cookie'; // Asegúrate de importar js-cookie

const useGetComandasWithPlatillos = () => {
  const [comandasWithPlatillos, setComandasWithPlatillos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComandasWithPlatillos = async () => {
      setLoading(true);
      const token = cookies.get('jwt-auth'); // Obtiene el token
      try {
        const response = await getComandasWithPlatillos(token);
        console.log('Respuesta del servidor:', response.data); // Inspecciona los datos que retorna el backend
        setComandasWithPlatillos(response.data.data || []);
        console.log('Estado actualizado:', response.data.data || []); // Verifica que el estado se actualiza correctamente
      } catch (err) {
        console.error('Error al obtener comandas con platillos:', err); // Imprime errores en consola
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComandasWithPlatillos(); // Llama a la función
  }, []);

  return { comandasWithPlatillos, loading, error };
};

export default useGetComandasWithPlatillos;
