import { useState } from 'react';
import { completeComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCompleteComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const complete = async (comandaId, token) => {
    setLoading(true);
    try {
      const response = await completeComanda(comandaId, token);
      return response;
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { complete, loading, error };
};

export default useCompleteComanda;
