import React from 'react';
import '../../styles/platillos.css';

const PlatilloCard = ({ platillo, isSelected, onSelectChange }) => {
    const handleCheckboxChange = (e) => {
        onSelectChange(platillo, e.target.checked);
    };

    // Función para formatear el precio
    const formatPrice = (price) => {
        if (price === 0 || price === undefined) {
            return 'Precio no asignado';
        }
        return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`; // Formato con separador de miles
    };

    // Determina la clase del precio
    const priceClass = (platillo.precio_platillo === 0 || platillo.precio_platillo === undefined)
        ? 'price-not-assigned' // Clase para "Precio no asignado"
        : 'price-assigned'; // Clase para precios asignados

    return (
        <div className="platillo-card" style={{ position: 'relative' }}>
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
                        <li key={idx}>
                            {ing.nombre_tipo_ingrediente} - {ing.porcion_ingrediente_platillo} {ing.unidad_medida?.nombre_unidad_medida || ''}
                        </li>
                    ))
                ) : (
                    <li>Sin ingredientes asignados</li>
                )}
            </ul>

            {/* Mostrar el precio del platillo */}
            <p className={priceClass}>
                {formatPrice(platillo.precio_platillo)}
            </p>
        </div>
    );
};

export default PlatilloCard;
