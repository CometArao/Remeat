import React from 'react';
import useCompleteComanda from '../../hooks/comandas/useCompleteComanda';
import { completeComandaAlert, showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const CompleteComandaButton = ({ comandaId, onComplete }) => {
  const { complete, loading } = useCompleteComanda();

  const handleComplete = async () => {
    const result = await completeComandaAlert();
    if (result.isConfirmed) {
      try {
        await complete(comandaId);
        showSuccessAlert('¡Comanda Completada!', 'La comanda ha sido completada exitosamente.');
      } catch (err) {
        showErrorAlert('Error',err.message);
        console.error('Error al completar la comanda:', err.message);
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
