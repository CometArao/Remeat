import React from 'react';
import useRemovePlatilloFromComanda from '../../hooks/comandas/useRemovePlatilloFromComanda';

const ComandaPlatillos = ({ platillos, comandaId, onPlatilloRemoved }) => {
  const { removePlatillo, loading, error } = useRemovePlatilloFromComanda();

  const handleRemove = async (platilloId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este platillo?')) {
      try {
        const result = await removePlatillo(comandaId, platilloId);
        if (result) {
          alert('Platillo eliminado exitosamente.');
          onPlatilloRemoved(platilloId); // Notificar al componente padre
        }
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
