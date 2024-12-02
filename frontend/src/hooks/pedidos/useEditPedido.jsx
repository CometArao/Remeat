// src/hooks/pedidos/useEditPedido.js

import { useState } from 'react';
import { updatePedido } from '@services/pedidos.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPedido = (setPedidos) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPedido, setDataPedido] = useState([]);

    const handleClickUpdate = () => {
        if (dataPedido.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedPedidoData) => {
        if (updatedPedidoData) {
            try {
                const updatedData = await updatePedido(
                    updatedPedidoData,
                    dataPedido[0].id_pedido
                );

                showSuccessAlert('¡Pedido Actualizado!', 'El pedido ha sido actualizado correctamente.');
                setIsPopupOpen(false);

                setPedidos((prev) =>
                    prev.map((pedido) =>
                        pedido.id_pedido === updatedData.id_pedido
                            ? updatedData
                            : pedido
                    )
                );

                setDataPedido([]);
            } catch (error) {
                console.error('Error al actualizar el pedido:', error);
                showErrorAlert('Error', 'Ocurrió un error al actualizar el pedido.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPedido,
        setDataPedido,
    };
};

export default useEditPedido;
