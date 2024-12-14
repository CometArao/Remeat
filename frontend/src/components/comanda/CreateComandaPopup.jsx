import React, { useEffect } from 'react';
import ComandaForm from './ComandaForm';
import useCreateComanda from '../../hooks/comandas/useCreateComanda';

const CreateComandaPopup = ({ isOpen, onClose }) => {
  const { create, loading } = useCreateComanda();

  const handleCreate = async () => {
    await create(); // Llamar al servicio sin pasar datos
    onClose();
    window.location.reload(); // Refrescar lista
  };

  if (!isOpen) return null;

  return (
    <div className="comandas-container">
      <button className="comanda-item-button" onClick={onClose}>
        &times; Cerrar
      </button>
      <h2>Crear Comanda</h2>
      {loading ? (
        <p>Creando comanda...</p>
      ) : (
        <ComandaForm onSubmit={handleCreate} />
      )}
    </div>
  );
};

export default CreateComandaPopup;
