import axios from './root.service.js';

// Función para manejar respuestas de error globales
const handleErrorResponse = (error) => {
    if (error.response?.status === 403) {
        console.warn('Acceso denegado: fuera de horario laboral.');
        window.location.href = '/fuera-horario'; // Redirige a la página específica
    } else {
        console.error('Error:', error.message);
    }
    throw error;
};

export async function getPedidos() {
    try {
        const { data } = await axios.get('/pedidos/');
        return data.data;
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        return error.response?.data || [];
    }
}

export async function createPedido(pedido) {
    try {
        const { data } = await axios.post('/pedidos/', pedido);
        return data.data;
    } catch (error) {
        console.error('Error creando pedido:', error);
        console.error('Respuesta del servidor:', error.response?.data); // Agrega este log
        throw error; // Lanza el error para que pueda ser capturado en handleCreate
    }
}

export async function updatePedido(pedido, id) {
    try {
        const { data } = await axios.put(`/pedidos/${id}`, pedido);
        return data.data;
    } catch (error) {
        console.error('Error updating pedido:', error);
        return error.response?.data;
    }
}

export async function deletePedido(id) {
    try {
        if (!id) throw new Error('ID no válido para eliminar el pedido.');

        const response = await axios.delete(`/pedidos/${id}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data; 
        } else {
            console.error('Error inesperado:', error);
            return { status: "Client error", message: error.message };
        }
    }
}

export async function confirmarPedidoService(id) {
    try {
        const response = await axios.post(`/pedidos/${id}/ingresar`);
        return response.data;
    } catch (error) {
        console.error('Error confirmando pedido:', error);
        throw error.response?.data || error.message;
    }
}
