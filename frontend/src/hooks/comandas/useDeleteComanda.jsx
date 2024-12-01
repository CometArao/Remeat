import { useState } from 'react';
import { deleteComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useDeleteComanda = () => {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      const token = cookies.get('jwt-auth');
      await deleteComanda(id, token);
    } catch (error) {
      console.error('Error eliminando la comanda:', error);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};

export default useDeleteComanda;
