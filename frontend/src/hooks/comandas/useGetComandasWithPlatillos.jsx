import { useState, useEffect } from 'react';
import { getComandasWithPlatillos } from '../../services/comanda.service';
import cookies from 'js-cookie';

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
        if (response.data && Array.isArray(response.data)) {
          // Agrupa los datos por idComanda
          const agrupados = response.data.reduce((acc, item) => {
            const { idComanda, fecha, tienePlatillos, nombrePlatillo, cantidad, estadoPlatillo } = item;
            if (!acc[idComanda]) {
              acc[idComanda] = {
                idComanda,
                fecha,
                tienePlatillos,
                platillos: [],
              };
            }
            if (nombrePlatillo) {
              acc[idComanda].platillos.push({ nombrePlatillo, cantidad, estadoPlatillo });
            }
            return acc;
          }, {});
          setComandasWithPlatillos(Object.values(agrupados));
        } else {
          setComandasWithPlatillos([]);
        }
      } catch (err) {
        setError(err);
        console.error('Error al obtener comandas con platillos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComandasWithPlatillos();
  }, []);

  return { comandasWithPlatillos, loading, error };
};

export default useGetComandasWithPlatillos;
