import React from 'react';
import '../../styles/menu.css';

const MenuCard = ({ menu, isSelected, onSelectChange, onActivate, isActivating }) => {
    return (
        <div className="menu-card" style={{ position: "relative" }}>
            <span className="card-id">ID: {menu.id_menu}</span>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="menu-title">{menu.fecha}</h2>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectChange(menu, e.target.checked)}
                />
            </div>

            <p className={menu.disponibilidad ? "status-available" : "status-unavailable"}>
                {menu.disponibilidad ? "Disponible" : "No disponible"}
            </p>

            <h4>Platillos:</h4>
            <ul className="menu-platillos">
                {menu.platillos?.map((platillo, idx) => (
                    <li key={idx}>{platillo.nombre_platillo}</li>
                )) || <li>Sin platillos asignados</li>}
            </ul>

            <button
                className="activate-button"
                onClick={() => onActivate(menu.id_menu)}
                disabled={menu.disponibilidad || isActivating} // Deshabilitar si ya está activo o se está activando
            >
                {menu.disponibilidad ? "Activo" : isActivating ? "Activando..." : "Activar"}
            </button>
        </div>
    );
};

export default MenuCard;
