import React from 'react';
import ComandaItem from './ComandaItem';

const ComandaList = ({ comandas, onDelete }) => {
  if (!Array.isArray(comandas) || comandas.length === 0) {
    return <p>No se encontraron comandas.</p>; 
  }

  return (
    <ul>
      {comandas.map((comanda) => (
        <ComandaItem key={comanda.id} {...comanda} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default ComandaList;
