import { useState } from 'react';
import { createPedido } from '@services/pedido.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreatePedido = (setPedidos) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataPedido, setDataPedido] = useState({});

    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    const handleCreate = async (newPedidoData) => {
        if (newPedidoData) {
            // Verificar si al menos hay un ingrediente o utensilio seleccionado
            if (
                (!newPedidoData.ingredientes || newPedidoData.ingredientes.length === 0) &&
                (!newPedidoData.utensilios || newPedidoData.utensilios.length === 0)
            ) {
                showErrorAlert("Error", "Debes seleccionar al menos un ingrediente o utensilio para crear un pedido.");
                return;
            }

            try {
                // Transformar ingredientes y utensilios
                if (newPedidoData.ingredientes) {
                    newPedidoData.ingredientes = newPedidoData.ingredientes.map(ing => ({
                        id_ingrediente: ing.id_ingrediente,
                        cantidad_ingrediente: ing.cantidad_ingrediente,
                    }));
                }

                if (newPedidoData.utensilios) {
                    newPedidoData.utensilios = newPedidoData.utensilios.map(ut => ({
                        id_utensilio: ut.id_utensilio,
                        cantidad_utensilio: ut.cantidad_utensilio,
                    }));
                }

                // Enviar al backend
                console.log("Datos del nuevo pedido:", newPedidoData);
                const createdPedido = await createPedido(newPedidoData);
                showSuccessAlert("¡Pedido Creado!", "El pedido se ha registrado correctamente.");
                setPedidos((prev) => [...prev, createdPedido]);
                setIsCreatePopupOpen(false);
            } catch (error) {
                console.error("Error al crear el pedido:", error);
                const errorMessage = error.response?.data?.message || "Ocurrió un problema al crear el pedido.";
                showErrorAlert("Error", errorMessage);
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