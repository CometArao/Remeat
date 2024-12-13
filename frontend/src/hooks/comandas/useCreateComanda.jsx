import { useState } from 'react';
import { createComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCreateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async () => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      const response = await createComanda({}, token); // Solicitud sin datos
      return response;
    } catch (error) {
      console.error('Error creando la comanda:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export default useCreateComanda;
