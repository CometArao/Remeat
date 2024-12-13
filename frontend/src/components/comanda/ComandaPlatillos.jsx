import React from 'react';
import useRemovePlatilloFromComanda from '../../hooks/comandas/useRemovePlatilloFromComanda';

const ComandaPlatillos = ({ platillos, comandaId, onPlatilloRemoved }) => {
  const { removePlatillo, loading, error } = useRemovePlatilloFromComanda();

  const handleRemove = async (platilloId) => {
    console.log('Comanda ID:', comandaId);
    console.log('Platillo ID:', platilloId); // Asegúrate de que no sea undefined
    if (!platilloId) {
      alert('Error: ID del platillo no encontrado.');
      return;
    }
  
    if (window.confirm('¿Estás seguro de que deseas eliminar este platillo?')) {
      try {
        const result = await removePlatillo(comandaId, platilloId);
        if (result) {
          alert('Platillo eliminado exitosamente.');
          onPlatilloRemoved(platilloId);
        }
      } catch (err) {
        console.error('Error eliminando el platillo:', err);
      }
    }
  };

  return (
    <div>
      {platillos.map((platillo) => (
        <div key={platillo.id_platillo} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>{platillo.nombre_platillo}</span>
          <button onClick={() => handleRemove(platillo.id_platillo)} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      ))}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ComandaPlatillos;
