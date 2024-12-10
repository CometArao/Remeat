import { useEffect, useState } from 'react';
import { getComandasWithPlatillos } from '../../services/comanda.service';

const useComandasWithPlatillos = () => {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComandas = async () => {
    try {
      const response = await getComandasWithPlatillos();
      console.log('Respuesta de la API:', response); // Agrega esto
      const data = response.data || []; // Maneja casos donde no haya datos
      const comandasEstructuradas = data.map((comanda) => ({
        idComanda: comanda.idComanda,
        fecha: comanda.fecha,
        platillos: [
          {
            idPlatillo: comanda.idPlatillo,
            nombrePlatillo: comanda.nombrePlatillo,
            cantidad: comanda.cantidad,
            estadoPlatillo: comanda.estadoPlatillo,
          },
        ],
      }));
      
      console.log('Comandas estructuradas:', comandasEstructuradas); // Agrega esto
      setComandas(comandasEstructuradas);
    } catch (err) {
      console.error('Error al cargar comandas:', err); // Cambia esto para mostrar más información
      setError(err.message || 'Error al cargar las comandas');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchComandas();
  }, []);

  return { comandas, loading, error, refetch: fetchComandas };
};

export default useComandasWithPlatillos;
