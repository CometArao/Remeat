import React from 'react';
import '../../styles/menu.css'; 

const MenuCard = ({ menu, isSelected, onSelectChange }) => {
    const handleCheckboxChange = (e) => {
        onSelectChange(menu, e.target.checked);
    };

    return (
        <div className="menu-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="menu-title">{menu.fecha}</h2> {/* Fecha ajustada */}
                <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            </div>

            {/* Mostrar el estado de disponibilidad del menú */}
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
