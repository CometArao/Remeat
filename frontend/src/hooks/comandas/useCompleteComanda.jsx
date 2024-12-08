import { useState } from 'react';
import { completeComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCompleteComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const complete = async (comandaId) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth');
      if (!token) throw new Error('Token no encontrado. Por favor, inicia sesión.');

      const response = await completeComanda(comandaId, token);
      return response;
    } catch (err) {
      console.error('Error completando la comanda:', err.message || err);
      setError(err.message || 'Error inesperado.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { complete, loading, error };
};

export default useCompleteComanda;
