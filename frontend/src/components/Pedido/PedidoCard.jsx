import React from 'react';
import '../../styles/pedidos.css'; // Usa los mismos estilos de pedidos como base

const PedidoCard = ({ pedido, usuarios, proveedores, isSelected, onSelectChange }) => {
    const usuario = usuarios.find((u) => u.id_usuario === pedido.id_usuario) || {};
    const proveedor = proveedores.find((p) => p.id_proveedor === pedido.id_proveedor) || {};

    const handleCheckboxChange = (e) => {
        onSelectChange(pedido, e.target.checked);
    };

    return (
        <div className="pedido-card" style={{ position: 'relative' }}> {/* Reutilizando estilos */ }
            {/* Mostrar la ID del pedido */}
            <span className="card-id">ID: {pedido.id_pedido}</span>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="menu-title">{pedido.descripcion_pedido}</h2>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            </div>

            {/* Mostrar el estado del pedido */}
            <p className={pedido.estado_pedido === "Pendiente" ? 'status-pending' : 'status-completed'}>
                {pedido.estado_pedido === "Pendiente" ? 'Pendiente' : 'Ingresado'}
            </p>

            {/* Fechas de compra y entrega */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div>
                    <h4>Fecha de Compra:</h4>
                    <p>{pedido.fecha_compra_pedido || 'No definida'}</p>
                </div>
                <div>
                    <h4>Fecha de Entrega:</h4>
                    <p>{pedido.fecha_entrega_pedido || 'No definida'}</p>
                </div>
            </div>

            <h4>Usuario:</h4>
            <p>{usuario.nombre_usuario || 'No asignado'}</p>

            <h4>Proveedor:</h4>
            <p>{proveedor.nombre_proveedor || 'No asignado'}</p>

            <h4>Ingredientes:</h4>
            <ul>
                {pedido.ingredientes && pedido.ingredientes.length > 0 ? (
                    pedido.ingredientes.map((ing, idx) => (
                        <li key={idx}>
                            {ing.nombre_tipo_ingrediente} - {ing.cantidad_ingrediente} unidades
                        </li>
                    ))
                ) : (
                    <li>Sin ingredientes asignados</li>
                )}
            </ul>

            <h4>Utensilios:</h4>
            <ul>
                {pedido.utensilios && pedido.utensilios.length > 0 ? (
                    pedido.utensilios.map((ut, idx) => (
                        <li key={idx}>
                            {ut.nombre_tipo_utensilio} - {ut.cantidad_utensilio} unidades
                        </li>
                    ))
                ) : (
                    <li>Sin utensilios asignados</li>
                )}
            </ul>

            <h4>Costo:</h4>
            <p>${pedido.costo_pedido.toFixed(2)}</p>
        </div>
    );
};

export default PedidoCard;
