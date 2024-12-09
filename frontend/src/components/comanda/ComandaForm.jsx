import React, { useState } from 'react';

const ComandaForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fecha_compra_comanda: '',
    hora_compra_comanda: '',
    id_usuario: '',
    estado_comanda: 'pendiente', // Valor predeterminado
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Fecha:</label>
      <input
        type="date"
        name="fecha_compra_comanda"
        value={formData.fecha_compra_comanda}
        onChange={handleChange}
        required
      />
      <label>Hora:</label>
      <input
        type="time"
        name="hora_compra_comanda"
        value={formData.hora_compra_comanda}
        onChange={handleChange}
        required
      />
      <label>ID Usuario:</label>
      <input
        type="number"
        name="id_usuario"
        value={formData.id_usuario}
        onChange={handleChange}
        required
      />
      <label>Estado de la Comanda:</label>
      <select
        name="estado_comanda"
        value={formData.estado_comanda}
        onChange={handleChange}
        required
      >
        <option value="pendiente">Pendiente</option>
      </select>
      <button type="submit">Crear Comanda</button>
    </form>
  );
};

export default ComandaForm;
