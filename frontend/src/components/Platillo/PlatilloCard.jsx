import React from 'react';
import '../../styles/platillos.css';

const PlatilloCard = ({ platillo, isSelected, onSelectChange }) => {
    const handleCheckboxChange = (e) => {
        onSelectChange(platillo, e.target.checked);
    };

    return (
        <div className="platillo-card" style={{ position: 'relative' }}> {/* Posición relativa para la ID */}
            {/* Mostrar la ID del platillo */}
            <span className="card-id">ID: {platillo.id_platillo}</span>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="menu-title">{platillo.nombre_platillo}</h2>
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
