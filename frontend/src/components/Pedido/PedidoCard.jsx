import React from 'react';
import '../../styles/pedidoCard.css';

const PedidoCard = ({ pedido, usuarios, proveedores, isSelected, onSelectChange }) => {

    const usuario = usuarios.find((u) => u.id_usuario === pedido.id_usuario) || {};
    const proveedor = proveedores.find((p) => p.id_proveedor === pedido.id_proveedor) || {};
    return (
        <div
            className={`pedido-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectChange(pedido)}
        >
            {/* Header */}
            <div className="card-header">
                <span className="card-id">ID: {pedido.id_pedido}</span>
                <span className={`pedido-status ${pedido.estado_pedido === 'Pendiente' ? 'pending' : 'completed'
                    }`}
                >
                    {pedido.estado_pedido === 'Pendiente' ? 'Pendiente' : 'Ingresado'}
                </span>
            </div>

            {/* Título */}
            <h2 className="pedido-title">{pedido.descripcion_pedido}</h2>

            {/* Fechas */}
            <div className="pedido-dates">
                <div>
                    <h4>Fecha de Compra:</h4>
                    <p>{pedido.fecha_compra_pedido || 'No definida'}</p>
                </div>
                <div>
                    <h4>Fecha de Entrega:</h4>
                    <p>{pedido.fecha_entrega_pedido || 'No definida'}</p>
                </div>
            </div>

            {/* Usuario y Proveedor */}
            <div className="pedido-info">
                <h4>Usuario:</h4>
                <p>{usuario.nombre_usuario || 'No asignado'}</p>

                <h4>Proveedor:</h4>
                <p>{proveedor.nombre_proveedor || 'No asignado'}</p>
            </div>

            {/* Ingredientes */}
            <div className="pedido-ingredientes">
                <h4>Ingredientes:</h4>
                <ul>
                    {pedido.ingredientes?.length > 0 ? (
                        pedido.ingredientes.map((ing, idx) => (
                            <li key={idx}>
                                {ing.nombre_tipo_ingrediente} - {ing.cantidad_ingrediente} unidades
                            </li>
                        ))
                    ) : (
                        <li>Sin ingredientes asignados</li>
                    )}
                </ul>
            </div>

            {/* Utensilios */}
            <div className="pedido-utensilios">
                <h4>Utensilios:</h4>
                <ul>
                    {pedido.utensilios?.length > 0 ? (
                        pedido.utensilios.map((ut, idx) => (
                            <li key={idx}>
                                {ut.nombre_tipo_utensilio} - {ut.cantidad_utensilio} unidades
                            </li>
                        ))
                    ) : (
                        <li>Sin utensilios asignados</li>
                    )}
                </ul>
            </div>

            {/* Costo */}
            <div className="pedido-footer">
                <h4>Costo Total:</h4>
                <p>${pedido.costo_pedido?.toFixed(2) || '0.00'}</p>
            </div>
        </div>
    );
};

export default PedidoCard;
