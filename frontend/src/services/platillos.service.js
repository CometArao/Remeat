import axios from './root.service.js';

export async function getPlatillos() {
    try {
        const { data } = await axios.get('/platillos/');
        console.log(data.data)
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getPlatilloById(id) {
    try {
        const response = await axios.get(`platillos/${id}`);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function createPlatillo(data) {
    try {
        const response = await axios.post('platillos/', data);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updatePlatillo(data, id) {
    try {
        const response = await axios.patch(`platillos/${id}`, data, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        console.log('Respuesta del backend:', response.data); // Debug
        return response.data.data;
    } catch (error) {
        console.error('Error al enviar PATCH:', error.response || error);
        throw new Error(
            error.response?.data?.message || 'Error desconocido al actualizar el platillo.'
        );
    }
}

export async function deletePlatillo(id) {
    try {
        const response = await axios.delete(`platillos/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}