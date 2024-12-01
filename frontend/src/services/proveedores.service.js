import axios from './root.service.js';

export async function getProveedores() {
    try {
        const token = sessionStorage.getItem('authToken'); // Obtener el token del almacenamiento
        const { data } = await axios.get('/proveedores/', {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en la solicitud
            },
        });
        return data.data;
    } catch (error) {
        console.error('Error en getProveedores:', error.response.data);
        throw error; // Lanza el error para que sea manejado por los hooks
    }
}

export async function createProveedor(data) {
    try {
        const response = await axios.post('/proveedores/', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateProveedor(data, id) {
    try {
        const response = await axios.patch(`/proveedores/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteProveedor(id) {
    try {
        const response = await axios.delete(`/proveedores/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
