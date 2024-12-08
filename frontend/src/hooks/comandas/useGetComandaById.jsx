import { useState } from 'react';
import { getComandaById } from '../../services/comanda.service'; 
import cookies from 'js-cookie';

const useGetComandaById = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchComanda = async (comandaId) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth'); 
      if (!token) throw new Error('Token no encontrado. Por favor, inicia sesión.');

      const response = await getComandaById(comandaId, token);
      if (response && response.data) {
        return response.data; // Devuelve solo los datos relevantes
      } else {
        throw new Error('Datos de comanda no encontrados.');
      }
    } catch (err) {
      console.error('Error obteniendo la comanda:', err.message || err);
      setError(err.message || 'Error inesperado.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchComanda }; 
};

export default useGetComandaById;
