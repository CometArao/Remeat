import React from 'react';
import useRemovePlatilloFromComanda from '../../hooks/comandas/useRemovePlatilloFromComanda';
import { deleteDataAlert, showSuccessAlert } from '../../helpers/sweetAlert';


const ComandaPlatillos = ({ platillos, comandaId, onPlatilloRemoved }) => {
  const { removePlatillo, loading, error } = useRemovePlatilloFromComanda();

  const handleRemove = async (platilloId) => {
    const confirmDelete = await deleteDataAlert();
    if (confirmDelete.isConfirmed) {
      try {
        await removePlatillo(comandaId, platilloId);
        showSuccessAlert('¡Éxito!', 'Platillo eliminado exitosamente.');
        onPlatilloRemoved(platilloId);
      } catch (err) {
        console.error('Error eliminando el platillo:', err);
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
          className="btn-delete" // Aplicamos el estilo desde el CSS
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      ))}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default ComandaPlatillos;
