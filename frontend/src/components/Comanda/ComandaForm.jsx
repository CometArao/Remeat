import React, { useState } from 'react';

const ComandaForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fecha_compra_comanda: '',
    hora_compra_comanda: '',
    id_usuario: '',
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
      <button type="submit">Crear Comanda</button>
    </form>
  );
};

export default ComandaForm;
