import { useState } from 'react';
import { updateComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useUpdateComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = async (comandaId, comandaData, token) => {
    setLoading(true);
    try {
      const response = await updateComanda(comandaId, comandaData, token);
      return response;
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export default useUpdateComanda;
