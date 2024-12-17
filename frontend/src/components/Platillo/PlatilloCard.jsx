import React from 'react';
import '../../styles/platilloCard.css';

const PlatilloCard = ({ platillo, isSelected, onSelectChange }) => {

    // Función para formatear el precio
    const formatPrice = (price) => {
        if (price === 0 || price === undefined) {
            return 'Precio no asignado';
        }
        return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };

    // Determina la clase del precio
    const priceClass = (platillo.precio_platillo === 0 || platillo.precio_platillo === undefined)
        ? 'price-not-assigned'
        : 'price-assigned';

    return (
        <div className={`platillo-card ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelectChange(platillo)}
        >
            {/* Mostrar la ID del platillo */}
            
            <span className="card-id">ID: {platillo.id_platillo}</span>

            {/* Encabezado de la tarjeta */}
            <div className="card-header">
                <h2 className="platillo-title">{platillo.nombre_platillo}</h2>
            </div>

            {/* Mostrar el estado de disponibilidad */}
            <span className={`platillo-status ${platillo.disponible ? 'available' : 'unavailable'}`}>
                {platillo.disponible ? 'Disponible' : 'No disponible'}
            </span>

            {/* Lista de ingredientes */}
            <div className="platillo-details">
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
            </div>

            {/* Mostrar el precio */}
            <p className={priceClass}>
                {formatPrice(platillo.precio_platillo)}
            </p>
        </div>
    );
};

export default PlatilloCard;
