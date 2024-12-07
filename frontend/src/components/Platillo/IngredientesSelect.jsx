import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from '../../services/root.service';

const IngredientesSelect = ({ value, onChange }) => {
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);

  useEffect(() => {
    const obtenerIngredientes = async () => {
      try {
        const response = await axios.get('/ingredientes/tipo');
        const opciones = response.data.map(ingrediente => ({
          value: ingrediente.id_tipo_ingrediente,
          label: ingrediente.nombre_tipo_ingrediente,
        }));
        setIngredientesSeleccionados(opciones);
      } catch (error) {
        console.error('Error al obtener los ingredientes:', error);
      }
    };

    obtenerIngredientes();
  }, []);

  return (
    <Select
      isMulti
      options={ingredientesSeleccionados}
      value={value}
      onChange={onChange}
      placeholder="Selecciona los ingredientes..."
    />
  );
};

export default IngredientesSelect;
