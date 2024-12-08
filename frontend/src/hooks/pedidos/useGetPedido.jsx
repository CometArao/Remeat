import { useState, useEffect } from 'react';
import { getPedidos } from '@services/pedido.service.js';

const useGetPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const formatDate = (date) => {
        if (!date) return "N/A";
        const utcDate = new Date(`${date}T00:00:00Z`); // Interpretar como UTC
        const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000); // Ajustar a local
        // Formatear la fecha manualmente en formato "dd-MM-yyyy"
        const day = String(localDate.getDate()).padStart(2, "0");
        const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript empiezan en 0
        const year = localDate.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            // Formatear las fechas antes de almacenarlas en el estado
            const formattedData = data.map((pedido) => ({
                ...pedido,
                fecha_compra_pedido: formatDate(pedido.fecha_compra_pedido),
                fecha_entrega_pedido: formatDate(pedido.fecha_entrega_pedido),
            }));
            setPedidos(formattedData);
        } catch (error) {
            console.error('Error fetching pedidos:', error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return { pedidos, fetchPedidos, setPedidos };
};

export default useGetPedidos;
