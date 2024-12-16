import { useState } from 'react';
import { deleteComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useDeleteComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth');
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      const response = await deleteComanda(id, token); 
      console.log('Comanda eliminada correctamente:', response);
      return true; 
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Comanda ya eliminada o no encontrada.');
      } else {
        console.error('Error eliminando la comanda:', err.message || err);
        setError(err.message || 'Error inesperado al eliminar la comanda.');
        throw err; 
      }
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export default useDeleteComanda;
