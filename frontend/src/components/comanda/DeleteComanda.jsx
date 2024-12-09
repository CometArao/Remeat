import React from 'react';
import useDeleteComanda from '../../hooks/comandas/useDeleteComanda';

const DeleteComanda = ({ comandaId, onDelete }) => {
  const { remove, loading } = useDeleteComanda();

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar la comanda ID: ${comandaId}?`)) {
      try {
        await remove(comandaId); // Elimina la comanda en el backend
        if (onDelete) {
          await onDelete(); // Notifica al padre para recargar la lista
        }
      } catch (error) {
        console.error('Error al eliminar la comanda:', error);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
};

export default DeleteComanda;
