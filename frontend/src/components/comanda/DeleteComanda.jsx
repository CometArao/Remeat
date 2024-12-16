import React from 'react';
import useDeleteComanda from '../../hooks/comandas/useDeleteComanda';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '../../helpers/sweetAlert';

const DeleteComanda = ({ comandaId, onDelete }) => {
  const { remove, loading } = useDeleteComanda();

  const handleDelete = async () => {
    const confirmDelete = await deleteDataAlert('¿Eliminar Comanda?',`¿Estás seguro de eliminar la comanda ID: ${comandaId}?`
    );

    if (confirmDelete.isConfirmed) {
      try {
        const success = await remove(comandaId); 
        if (success) {
          showSuccessAlert('¡Eliminada!', 'La comanda ha sido eliminada.');
          if (onDelete) await onDelete(); 
        }
      } catch (error) {
        showErrorAlert('Error', 'No se pudo eliminar la comanda.');
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
