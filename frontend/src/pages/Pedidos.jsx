import React, { useEffect, useState } from 'react';
import { getPedidos, createPedido, updatePedido, deletePedido } from '@services/pedido.service';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar pedidos al montar el componente
        const fetchPedidos = async () => {
            try {
                const data = await getPedidos();
                setPedidos(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchPedidos();
    }, []);

    // Renderizar pedidos
    return (
        <div className="pedidos">
            <h1>Gestión de Pedidos</h1>
            {error && <p>Error: {error}</p>}
            <ul>
                {pedidos.map((pedido) => (
                    <li key={pedido.id_pedido}>
                        <p><strong>ID:</strong> {pedido.id_pedido}</p>
                        <p><strong>Descripción:</strong> {pedido.descripcion_pedido}</p>
                        <p><strong>Estado:</strong> {pedido.estado_pedido}</p>
                        <p><strong>Costo:</strong> ${pedido.costo_pedido}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pedidos;
