// src/services/pedidos.service.js

import axios from './root.service.js';

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

        const { data } = await axios.delete(`/pedidos/${id}`, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        return data;
    } catch (error) {
        console.error('Error deleting pedido:', error);
        return error.response?.data || { status: 'Client error', details: error.message };
    }
}
