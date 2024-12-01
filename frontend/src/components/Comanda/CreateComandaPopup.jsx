import React from 'react';
import ComandaForm from './ComandaForm';
import useCreateComanda from '../../hooks/Comandas/useCreateComanda';

const CreateComandaPopup = ({ isOpen, onClose }) => {
  const { create, loading } = useCreateComanda();

  const handleCreate = async (formData) => {
    await create(formData);
    onClose(); // Cierra el popup tras crear
    window.location.reload(); // Refresca el listado
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Crear Comanda</h2>
        <ComandaForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default CreateComandaPopup;
