import { useState } from 'react';
import { removePlatilloFromComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useRemovePlatilloFromComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removePlatillo = async (comandaId, platilloId) => {
    setLoading(true);
    setError(null);
    try {
      const token = cookies.get('jwt-auth');
      if (!token) throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      await removePlatilloFromComanda(comandaId, platilloId, token);
    } catch (err) {
      console.error('Error al eliminar el platillo:', err.response?.data?.message || err.message);
      setError(err);
      throw err; // Lanza el error para que el componente lo capture
    } finally {
      setLoading(false);
    }
  };

  return { removePlatillo, loading, error };
};

export default useRemovePlatilloFromComanda;
