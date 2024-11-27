import { useState, useEffect } from 'react';
import { getIngredientes } from '@services/ingredientes.service.js';

const useGetIngrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);

  const fetchIngredientes = async () => {
    try {
      const response = await getIngredientes();
      setIngredientes(response.data); // Asegúrate de que el backend devuelve los datos correctamente.
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  return { ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetIngrediente;