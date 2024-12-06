import axios from './root.service.js';

// Obtener todos los pedidos
export async function getPedidos() {
    try {
        const response = await axios.get('/pedidos');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        throw error.response?.data || error.message;
    }
}

// Crear un nuevo pedido
export async function createPedido(data) {
    try {
        const response = await axios.post('/pedidos', data);
        return response.data;
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw error.response?.data || error.message;
    }
}

// Actualizar un pedido
export async function updatePedido(id_pedido, data) {
    try {
        const response = await axios.put(`/pedidos/${id_pedido}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        throw error.response?.data || error.message;
    }
}

// Eliminar un pedido
export async function deletePedido(id_pedido) {
    try {
        const response = await axios.delete(`/pedidos/${id_pedido}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        throw error.response?.data || error.message;
    }
}