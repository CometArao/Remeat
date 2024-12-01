import React from 'react';
import useCompleteComanda from '../../hooks/Comandas/useCompleteComanda';

const ComandaItem = ({ comanda, onRefresh }) => {
  const { complete, loading } = useCompleteComanda();

  const handleComplete = async () => {
    if (window.confirm(`¿Deseas completar la comanda ID ${comanda.id_comanda}?`)) {
      await complete(comanda.id_comanda, 'YOUR_TOKEN');
      onRefresh(); // Refresca la lista
    }
  };

  return (
    <div className="comanda-item">
      <h3>Comanda ID: {comanda.id_comanda}</h3>
      <p>Fecha: {comanda.fecha_compra_comanda}</p>
      <p>Estado: {comanda.estado_comanda}</p>
      <button onClick={handleComplete} disabled={loading}>
        {loading ? 'Completando...' : 'Completar'}
      </button>
    </div>
  );
};

export default ComandaItem;
