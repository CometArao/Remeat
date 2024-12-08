import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from '../../services/root.service';

const IngredientesSelect = ({ value, onChange }) => {
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);

  useEffect(() => {
    const obtenerIngredientes = async () => {
      try {
        const response = await axios.get('/ingredientes/tipo');
        const opciones = response.data.data.map(ingrediente => ({
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

  // Estilos personalizados para react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '35px',         // Control más bajo
      fontSize: '14px',          // Fuente un poco más pequeña
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px',        // Menos padding interno
    }),
    multiValue: (base) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      padding: '2px 6px',        // Menos padding en el chip
      borderRadius: '4px',
      fontSize: '13px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      padding: '0',              // Quita padding extra
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: '50%',
      fontSize: '12px',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      marginLeft: '8px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#d1d1d1',
        color: '#333',
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '0px', // Quita espacio extra en el icono de dropdown
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '0px', // Quita espacio extra en el icono de clear
    }),
    indicatorsContainer: (base) => ({
      ...base,
      '> div': {
        padding: '0 4px', // Menos espacio entre indicadores
      },
    }),
  };

  return (
    <Select
      isMulti
      options={ingredientesSeleccionados}
      value={value}
      onChange={onChange}
      placeholder="Selecciona los ingredientes..."
      styles={customStyles}
      noOptionsMessage={() => 'No hay ingredientes disponibles'}
    />
  );
};

export default IngredientesSelect;
