import React, { useState } from 'react';

const ComandaForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Nombre de la comanda"
      />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ComandaForm;
