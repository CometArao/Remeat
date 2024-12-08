import React from 'react';
import ComandaForm from './ComandaForm';
import useCreateComanda from '../../hooks/Comandas/useCreateComanda';

const CreateComandaPopup = ({ isOpen, onClose }) => {
  const { create, loading } = useCreateComanda();

  const handleCreate = async (formData) => {
    await create(formData);
    onClose(); // Cierra el formulario tras la creación
    window.location.reload(); // Refresca el listado
  };

  if (!isOpen) return null;

  return (
    <div className="comandas-container">
      <button className="comanda-item-button" onClick={onClose}>
        &times; Cerrar
      </button>
      <h2>Crear Comanda</h2>
      <ComandaForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateComandaPopup;
