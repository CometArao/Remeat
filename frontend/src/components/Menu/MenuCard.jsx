import React from 'react';
import '../../styles/menu.css';

const MenuCard = ({ menu, isSelected, onSelectChange }) => {
    const handleCheckboxChange = (e) => {
        onSelectChange(menu, e.target.checked);
    };

    return (
        <div className="menu-card" style={{ position: 'relative' }}> {/* Posición relativa para la ID */}
            {/* Mostrar la ID del menú */}
            <span className="card-id">ID: {menu.id_menu}</span>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="menu-title">{menu.fecha}</h2>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            </div>

            {/* Mostrar el estado de disponibilidad */}
            <p className={menu.disponibilidad ? 'status-available' : 'status-unavailable'}>
                {menu.disponibilidad ? 'Disponible' : 'No disponible'}
            </p>

            <h4>Platillos:</h4>
            <ul className="menu-platillos">
                {menu.platillos && menu.platillos.length > 0 ? (
                    menu.platillos.map((platillo, idx) => (
                        <li key={idx}>{platillo.nombre_platillo}</li>
                    ))
                ) : (
                    <li>Sin platillos asignados</li>
                )}
            </ul>
        </div>
    );
};

export default MenuCard;
