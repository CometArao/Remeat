import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SeleccionConCantidad = ({ options, value, onChange, placeholder = "Selecciona las opciones..." }) => {
  const [seleccionados, setSeleccionados] = useState(value || []);

  useEffect(() => {
    // Se actualiza el valor interno
    setSeleccionados(value || []);
  }, [value]);

  const manejarCambio = (seleccion) => {
    const seleccionConCantidad = (seleccion || []).map((item) => {
      const existente = seleccionados.find((sel) => sel.value === item.value);
      return {
        ...item,
        cantidad: existente ? existente.cantidad : 1,
      };
    });
    setSeleccionados(seleccionConCantidad);
    onChange(seleccionConCantidad);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevosSeleccionados = [...seleccionados];
    nuevosSeleccionados[index].cantidad = parseFloat(nuevaCantidad) || 1;
    setSeleccionados(nuevosSeleccionados);
    onChange(nuevosSeleccionados);
  };

  return (
    <div>
      <Select
        isMulti
        options={options}
        value={seleccionados}
        onChange={manejarCambio}
        placeholder={placeholder}
        noOptionsMessage={() => 'No hay opciones disponibles'}
      />
      {seleccionados.length > 0 && (
        <div className="opciones-cantidades">
          {seleccionados.map((item, index) => (
            <div key={item.value} className="opcion-cantidad">
              <span>{item.label}</span>
              <input
                type="number"
                min="1"
                step="1"
                value={item.cantidad}
                onChange={(e) => actualizarCantidad(index, e.target.value)}
                placeholder="Cantidad"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeleccionConCantidad;
