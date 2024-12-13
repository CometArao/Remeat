import { useState } from 'react';
import { removePlatilloFromComanda } from '../../services/comanda.service';
import cookies from 'js-cookie';

const useRemovePlatilloFromComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const removePlatillo = async (comandaId, platilloId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = cookies.get('jwt-auth'); // Obtiene el token del usuario autenticado
      const response = await removePlatilloFromComanda(comandaId, platilloId, token);
      console.log('Pablo'+comandaId, platilloId);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error('Error eliminando el platillo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removePlatillo, loading, error, success };
};

export default useRemovePlatilloFromComanda;
