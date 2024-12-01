import React, { useState } from 'react';

const EditComandaForm = ({ comanda, onSubmit }) => {
  const [formData, setFormData] = useState({
    fecha_compra_comanda: comanda.fecha_compra_comanda || '',
    hora_compra_comanda: comanda.hora_compra_comanda || '',
    estado_comanda: comanda.estado_comanda || 'pendiente',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comanda.id_comanda, formData); // Llama a la función `onSubmit` con los datos actualizados
  };

  return (
    <form onSubmit={handleSubmit} className="edit-comanda-form">
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
      <label>Estado de la Comanda:</label>
      <select
        name="estado_comanda"
        value={formData.estado_comanda}
        onChange={handleChange}
        required
      >
        <option value="pendiente">Pendiente</option>
        <option value="en proceso">En Proceso</option>
        <option value="completada">Completada</option>
      </select>
      <button type="submit">Guardar Cambios</button>
    </form>
  );
};

export default EditComandaForm;
