import { useState, useEffect } from 'react';
import { getIngredientes } from '@services/ingredientes.service.js';
import { getTiposIngrediente } from '../../services/ingredientes.service';

const useGetTipoIngrediente = () => {
  const [ingredientes, setIngredientes] = useState([]);

  const fetchIngredientes = async () => {
    try {
      const response = await getTiposIngrediente();
      console.log("useGetTipoIngrediente")
      console.log(response)
      console.log(response.data)
      const formatedData = response.data.map(ingrediente => ({
        id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
        nombre_tipo_ingrediente: ingrediente.nombre_tipo_ingrediente,
      }));
      console.log("formatedData")
      console.log(formatedData)
      setIngredientes(formatedData); // Asegúrate de que el backend devuelve los datos correctamente.
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  console.log(ingredientes)
  return { ingredientes: ingredientes, fetchIngredientes, setIngredientes };
};

export default useGetTipoIngrediente;