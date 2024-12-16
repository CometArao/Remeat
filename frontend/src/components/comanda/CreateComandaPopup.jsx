import React, { useState } from 'react';
import ComandaForm from './ComandaForm';
import useCreateComanda from '../../hooks/comandas/useCreateComanda';

const CreateComandaPopup = ({ isOpen, onClose }) => {
  const { create, loading, error, platillos, loadingPlatillos } = useCreateComanda();
  const [selectedPlatillo, setSelectedPlatillo] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const handleCreate = async () => {
    if (!selectedPlatillo) {
      alert('Por favor, selecciona un platillo.');
      return;
    }

    const data = {
      platillo: { 
        nombre_platillo: selectedPlatillo,
        cantidad: cantidad,
      },
    };

    try {
      await create(data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creando comanda:', error);
    }
  };

  if (!isOpen) return null;


  

  return (
    <div className="comandas-container">
      <button className="comanda-item-button" onClick={onClose}>
        &times; Cerrar
      </button>
      <h2>Crear Comanda</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loadingPlatillos ? (
        <p>Cargando platillos...</p>
      ) : (
        <ComandaForm
          platillos={platillos}
          selectedPlatillo={selectedPlatillo}
          setSelectedPlatillo={setSelectedPlatillo}
          cantidad={cantidad}
          setCantidad={setCantidad}
          onSubmit={handleCreate}
          loading={loading}
        />
      )}
    </div>
  );

};

export default CreateComandaPopup;
