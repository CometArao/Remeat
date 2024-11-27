import React from 'react';

const ComandaItem = ({ comanda, onDelete }) => {
  return (
    <li>
      {comanda.name}
      <button onClick={() => onDelete(comanda.id)}>Eliminar</button>
    </li>
  );
};

export default ComandaItem;
