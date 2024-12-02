// src/hooks/pedidos/useCreatePedido.js

import { useState } from 'react';
import { createPedido } from '@services/pedidos.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreatePedido = (setPedidos) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataPedido, setDataPedido] = useState({});

    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    const handleCreate = async (newPedidoData) => {
        if (newPedidoData) {
            try {
                // Transformar ingredientes si es necesario
                if (newPedidoData.ingredientes) {
                    newPedidoData.ingredientes = newPedidoData.ingredientes.map((id) => ({ id_ingrediente: id }));
                }

                // Establecer estado_pedido como 'pendiente'
                newPedidoData.estado_pedido = 'pendiente';

                console.log('Datos del nuevo pedido:', newPedidoData);
                const createdPedido = await createPedido(newPedidoData);
                showSuccessAlert('¡Pedido Creado!', 'El pedido se ha registrado correctamente.');
                setPedidos((prev) => [...prev, createdPedido]);
                setIsCreatePopupOpen(false);
            } catch (error) {
                console.error('Error al crear el pedido:', error);
                const errorMessage = error.response?.data?.message || 'Ocurrió un problema al crear el pedido.';
                showErrorAlert('Error', errorMessage);
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataPedido,
        setDataPedido,
    };
};

export default useCreatePedido;
