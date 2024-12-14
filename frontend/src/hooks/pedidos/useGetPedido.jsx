import { useState, useEffect } from 'react';
import { getPedidos } from '@services/pedido.service.js';
import { formatDateTimeCL } from '../../../../backend/src/utils/dateUtils.js';

const useGetPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    // Método para obtener pedidos del backend y formatear las fechas
    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();

            const formattedData = data.map((pedido) => ({
                ...pedido,
                
                fecha_compra_pedido: formatDateTimeCL(pedido.fecha_compra_pedido),
                fecha_entrega_pedido: formatDateTimeCL(pedido.fecha_entrega_pedido),
            }));
            console.log(formattedData);
            setPedidos(formattedData);
        } catch (error) {
            console.error('Error fetching pedidos:', error);
        }
    };

    return { pedidos, fetchPedidos };
};

export default useGetPedidos;
