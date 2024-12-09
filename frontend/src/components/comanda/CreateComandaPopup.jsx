import React, { useEffect } from 'react';
import ComandaForm from './ComandaForm';
import useCreateComanda from '../../hooks/comandas/useCreateComanda';

const CreateComandaPopup = ({ isOpen, onClose }) => {
  const { meseros, fetchMeseros, loadingMeseros, create } = useCreateComanda();

  useEffect(() => {
    if (isOpen) fetchMeseros();
  }, [isOpen]);

  const handleCreate = async (formData) => {
    await create(formData);
    onClose();
    window.location.reload(); // Refresca la lista
  };

  if (!isOpen) return null;

  return (
    <div className="comandas-container">
      <button className="comanda-item-button" onClick={onClose}>
        &times; Cerrar
      </button>
      <h2>Crear Comanda</h2>
      {loadingMeseros ? (
        <p>Cargando meseros...</p>
      ) : (
        <ComandaForm meseros={meseros} onSubmit={handleCreate} />
      )}
    </div>
  );
};

export default CreateComandaPopup;
