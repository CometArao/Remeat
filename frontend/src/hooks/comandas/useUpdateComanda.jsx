import { useState } from 'react';
import { updateComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useUpdateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = async (comandaId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth');
      if (!token) throw new Error('Token no encontrado. Por favor, inicia sesión.');

      const response = await updateComanda(comandaId, updatedData, token);
      return response;
    } catch (err) {
      console.error('Error actualizando la comanda:', err.message || err);
      setError(err.message || 'Error inesperado.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export default useUpdateComanda;
