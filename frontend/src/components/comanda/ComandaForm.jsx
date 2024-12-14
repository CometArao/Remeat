import React from 'react';

const ComandaForm = ({ onSubmit }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <button type="submit">Crear Comanda</button>
    </form>
  );
};

export default ComandaForm;
