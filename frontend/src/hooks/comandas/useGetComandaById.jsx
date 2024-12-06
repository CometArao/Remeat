import { useState } from 'react';
import { getComandaById } from '../../services/comanda.service'; 
import cookies from 'js-cookie';

const useGetComandaById = () => {
  const [comanda, setComanda] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchComanda = async (comandaId) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth'); 
      if (!token) throw new Error('Token no encontrado. Por favor, inicia sesión.');

      const data = await getComandaById(comandaId, token);
      setComanda(data); 
    } catch (err) {
      console.error('Error obteniendo la comanda:', err.message || err);
      setError(err.message || 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return { comanda, loading, error, fetchComanda }; 
};

export default useGetComandaById;
