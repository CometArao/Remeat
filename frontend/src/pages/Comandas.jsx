import React, { useState } from 'react';
import ComandaList from '../components/comanda/ComandaList';
import ComandasWithPlatillosList from '../components/comanda/ComandasWithPlatillosList';
import CreateComandaPopup from '../components/comanda/CreateComandaPopup';
import '@styles/Comandas.css'; // Importa el CSS aquí

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
    <div className="comandas-container">
      <h1 className="comanda-title">Gestión de Comandas</h1>

      <div>
        {/* Botones para cambiar entre las vistas */}
        <button className="btn" onClick={() => setView('default')}>Ver Comandas</button>
        <button className="btn" onClick={() => setView('withPlatillos')}>Ver Comandas con Platillos</button>
        <button className="btn" onClick={handleOpenPopup}>Nueva Comanda</button>
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
