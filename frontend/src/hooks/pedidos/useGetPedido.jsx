import { useState, useEffect } from 'react';
import { getPedidos } from '@services/pedido.service.js';

const useGetPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            setPedidos(data);
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