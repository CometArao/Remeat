import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from '../../services/root.service';

const IngredientesSelect = ({ value, onChange }) => {
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [seleccionados, setSeleccionados] = useState(value || []);

  useEffect(() => {
    const obtenerIngredientes = async () => {
      try {
        const response = await axios.get('/ingredientes/tipo');
        const opciones = response.data.data.map((ingrediente) => ({
          value: ingrediente.id_tipo_ingrediente,
          label: ingrediente.nombre_tipo_ingrediente,
        }));
        setIngredientesDisponibles(opciones);
      } catch (error) {
        console.error('Error al obtener los ingredientes:', error);
      }
    };

    obtenerIngredientes();
  }, []);

  const manejarCambio = (ingredientes) => {
    const ingredientesConPorcion = ingredientes.map((ingrediente) => {
      const existente = seleccionados.find((sel) => sel.value === ingrediente.value);
      return {
        ...ingrediente,
        porcion: existente ? existente.porcion : 1,
      };
    });
    setSeleccionados(ingredientesConPorcion);
    onChange(ingredientesConPorcion);
  };

  const actualizarPorcion = (index, nuevaPorcion) => {
    const nuevosSeleccionados = [...seleccionados];
    nuevosSeleccionados[index].porcion = parseFloat(nuevaPorcion) || 1;
    setSeleccionados(nuevosSeleccionados);
    onChange(nuevosSeleccionados);
  };

  return (
    <div>
      <Select
        isMulti
        options={ingredientesDisponibles}
        value={seleccionados}
        onChange={manejarCambio}
        placeholder="Selecciona los ingredientes..."
        noOptionsMessage={() => 'No hay ingredientes disponibles'}
      />
      {seleccionados.length > 0 && (
        <div className="ingredientes-porciones">
          {seleccionados.map((ingrediente, index) => (
            <div key={ingrediente.value} className="ingrediente-porcion">
              <span>{ingrediente.label}</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={ingrediente.porcion}
                onChange={(e) => actualizarPorcion(index, e.target.value)}
                placeholder="Porción"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientesSelect;
