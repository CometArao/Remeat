import { useState } from 'react';
import { addPlatilloToComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useAddPlatilloToComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPlatillo = async (comandaId, platilloData, token) => {
    setLoading(true);
    try {
      const response = await addPlatilloToComanda(comandaId, platilloData, token);
      return response;
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { addPlatillo, loading, error };
};

export default useAddPlatilloToComanda;
