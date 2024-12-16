import React from 'react';
import useRemovePlatilloFromComanda from '../../hooks/comandas/useRemovePlatilloFromComanda';
import { deleteDataAlert, showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const ComandaPlatillos = ({ platillos, comandaId, onPlatilloRemoved }) => {
  const { removePlatillo, loading } = useRemovePlatilloFromComanda();

  const handleRemove = async (platilloId) => {
    const confirmDelete = await deleteDataAlert('¿Eliminar Platillo?', 'Esta acción no se puede deshacer.');
    if (confirmDelete.isConfirmed) {
      try {
        await removePlatillo(comandaId, platilloId);
        showSuccessAlert('¡Éxito!', 'Platillo eliminado exitosamente.');
        onPlatilloRemoved(platilloId);
      } catch (err) {
        showErrorAlert(
          'Error',
          err.response?.data?.message || 'No se pudo eliminar el platillo debido a su estado.'
        );
      }
    }
  };

  return (
    <div>
      {platillos.map((platillo) => (
        <button
          key={platillo.idPlatillo}
          onClick={() => handleRemove(platillo.idPlatillo)}
          disabled={loading}
          className="btn-delete"
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      ))}
    </div>
  );
};

export default ComandaPlatillos;
