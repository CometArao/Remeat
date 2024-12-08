import React from 'react';
import useCompleteComanda from '../../hooks/comandas/useCompleteComanda';

const CompleteComandaButton = ({ comandaId, onComplete }) => {
  const { complete, loading } = useCompleteComanda();

  const handleComplete = async () => {
    if (window.confirm(`¿Estás seguro de completar la comanda ID: ${comandaId}?`)) {
      try {
        await complete(comandaId);
        if (onComplete) {
          onComplete(comandaId); // Notifica al padre para actualizar la lista
        }
        alert('¡Comanda completada exitosamente!');
      } catch (err) {
        console.error('Error al completar la comanda:', err);
      }
    }
  };

  return (
    <button onClick={handleComplete} disabled={loading}>
      {loading ? 'Completando...' : 'Completar Comanda'}
    </button>
  );
};

export default CompleteComandaButton;
