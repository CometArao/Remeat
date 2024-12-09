import React, { useState } from 'react';

const ComandaForm = ({ meseros, onSubmit }) => {
  const [formData, setFormData] = useState({
    fecha_compra_comanda: '',
    hora_compra_comanda: '',
    email: '',
    estado_comanda: 'pendiente',
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

      <label>Mesero:</label>
      <select
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un mesero</option>
        {meseros.map((mesero) => (
          <option key={mesero.id_usuario} value={mesero.correo_usuario}>
            {mesero.nombre_usuario} {mesero.apellido_usuario} ({mesero.correo_usuario})
          </option>
        ))}
      </select>

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
