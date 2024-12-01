import { useState } from 'react';
import { addPlatilloToComanda } from '../../services/comanda.service';
import cookies from 'js-cookie'; // Importamos cookies para manejar el token

const useAddPlatilloToComanda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPlatillo = async (comandaId, platilloData) => {
    setLoading(true);
    setError(null);

    try {
      const token = cookies.get('jwt-auth'); // Obtenemos el token del usuario
      await addPlatilloToComanda(comandaId, platilloData, token);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { addPlatillo, loading, error };
};

export default useAddPlatilloToComanda;
