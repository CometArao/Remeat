import React from 'react';
import '../../styles/menuCard.css';

const MenuCard = ({ menu, isSelected, onSelectChange, onActivate, isActivating }) => {
    return (
        <div
            className={`menu-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectChange(menu)} // Selecciona/deselecciona tarjeta
        >
            {/* Header */}
            <div className="card-header">
                <span className="card-id">ID: {menu.id_menu}</span>
                <span className={`menu-status ${menu.disponibilidad ? 'available' : 'unavailable'}`}>
                    {menu.disponibilidad ? 'Disponible' : 'No disponible'}
                </span>
            </div>

            {/* Título */}
            <h2 className="menu-title">{menu.fecha}</h2>

            {/* Lista de Platillos */}
            <div className="menu-platillos">
                <h4>Platillos:</h4>
                <ul>
                    {menu.platillos?.length > 0 ? (
                        menu.platillos.map((platillo, idx) => <li key={idx}>{platillo.nombre_platillo}</li>)
                    ) : (
                        <li>Sin platillos asignados</li>
                    )}
                </ul>
            </div>

            {/* Botón Activar/Desactivar */}
            <button
                className="activate-button"
                onClick={(e) => {
                    e.stopPropagation(); // Evita conflicto con selección
                    onActivate(menu.id_menu, menu.disponibilidad);
                }}
                disabled={isActivating}
            >
                {isActivating ? 'Procesando...' : menu.disponibilidad ? 'Desactivar' : 'Activar'}
            </button>
        </div>
    );
};

export default MenuCard;
