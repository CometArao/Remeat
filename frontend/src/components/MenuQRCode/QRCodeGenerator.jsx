import React, { useState } from 'react';

const QRCodeGenerator = ({ onGenerate }) => {
  const [menuId, setMenuId] = useState(''); 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!menuId) {
      alert('Por favor, ingrese un ID de menú válido.'); 
      return;
    }
    onGenerate(menuId); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID del Menú"
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)} 
        />
        <button type="submit">Generar QR</button>
      </form>
    </div>
  );
};

export default QRCodeGenerator;
