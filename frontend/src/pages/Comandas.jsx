import React, { useState } from 'react';
import ComandaList from '../components/comanda/ComandaList';
import ComandasWithPlatillosList from '../components/comanda/ComandasWithPlatillosList';
import CreateComandaPopup from '../components/comanda/CreateComandaPopup';

const Comandas = () => {
  const [view, setView] = useState('default'); // Controla qué vista mostrar
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controla el estado del popup

  const handleOpenPopup = () => {
    setIsPopupOpen(true); // Abre el popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Cierra el popup
  };

  return (
    <div className="comandas-page">
      <h1>Gestión de Comandas</h1>

      <div className="comandas-actions">
        {/* Botones para cambiar entre las vistas */}
        <button onClick={() => setView('default')}>Ver Comandas</button>
        <button onClick={() => setView('withPlatillos')}>Ver Comandas con Platillos</button>
        <button onClick={handleOpenPopup}>Nueva Comanda</button>
      </div>

      {/* Renderizar el popup para crear comanda */}
      <CreateComandaPopup isOpen={isPopupOpen} onClose={handleClosePopup} />

      {/* Renderiza el componente según la vista seleccionada */}
      {view === 'default' && <ComandaList />}
      {view === 'withPlatillos' && <ComandasWithPlatillosList />}
    </div>
  );
};

export default Comandas;
