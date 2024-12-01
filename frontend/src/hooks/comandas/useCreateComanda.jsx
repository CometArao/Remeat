import { useState } from 'react';
import { createComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useCreateComanda = () => {
  const [loading, setLoading] = useState(false);

  const create = async (comandaData) => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      const response = await createComanda(comandaData, token);
      return response;
    } catch (error) {
      console.error('Error creando la comanda:', error);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};

export default useCreateComanda;
