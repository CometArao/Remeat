import React from 'react';
import useDeleteComanda from '../../hooks/Comandas/useDeleteComanda';

const ComandaItem = ({ comanda }) => {
  const { remove, loading } = useDeleteComanda();

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar la comanda ID: ${comanda.id_comanda}?`)) {
      await remove(comanda.id_comanda);
      window.location.reload(); // Actualizar listado tras eliminar
    }
  };

  return (
    <li>
      <h3>Comanda ID: {comanda.id_comanda}</h3>
      <p>Fecha: {comanda.fecha_compra_comanda}</p>
      <p>Hora: {comanda.hora_compra_comanda}</p>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </li>
  );
};

export default ComandaItem;
