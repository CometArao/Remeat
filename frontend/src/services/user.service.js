import axios from './root.service.js';

export async function getUsers() {
    try {
        const { data } = await axios.get('/usuarios/');
        return data.data; // Asegúrate de que el backend envíe esta estructura
    } catch (error) {
        console.error('Error en getUsers:', error);
        return [];
    }
}

export async function createUser(data) {
    try {
        const response = await axios.post('/usuarios/', data);
        return response.data;
    } catch (error) {
        console.error('Error en createUser:', error);
        throw error; // Manejo de errores desde el frontend
    }
}

export async function updateUser(data, id) {
    try {
        const response = await axios.patch(`/usuarios/${id}`, data); // Usar id_usuario
        return response.data;
    } catch (error) {
        console.error('Error en updateUser:', error);
        throw error;
    }
}

export async function deleteUser(id_usuario) {
    try {
        const response = await axios.delete(`/usuarios/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteUser:', error);
        throw error; // Manejo de errores desde el frontend
    }
}
