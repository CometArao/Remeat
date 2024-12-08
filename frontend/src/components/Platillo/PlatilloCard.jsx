import React from 'react';
import '../../styles/platillos.css'; // Aquí asumes que ya tienes los estilos

const PlatilloCard = ({ platillo, isSelected, onSelectChange }) => {
  const handleCheckboxChange = (e) => {
    onSelectChange(platillo, e.target.checked);
  };

  return (
    <div className="platillo-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{platillo.nombre_platillo}</h2>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      </div>

      {/* Mostrar el estado de disponibilidad */}
      <p className={platillo.disponible ? 'status-available' : 'status-unavailable'}>
        {platillo.disponible ? 'Disponible' : 'No disponible'}
      </p>
      <h4>Ingredientes:</h4>
      <ul>
        {platillo.ingredientes && platillo.ingredientes.length > 0 ? (
          platillo.ingredientes.map((ing, idx) => (
            <li key={idx}>{ing.nombre_tipo_ingrediente}</li>
          ))
        ) : (
          <li>Sin ingredientes asignados</li>
        )}
      </ul>
    </div>
  );
};

export default PlatilloCard;
