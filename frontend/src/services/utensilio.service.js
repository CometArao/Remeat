import axios from './root.service.js';

// Redirigir al usuario a una página específica en caso de error
const handleErrorResponse = (error) => {
    if (error.response?.status === 403) {
        console.warn('Acceso denegado: fuera de horario laboral.');
        window.location.href = '/fuera-horario'; // Redirige a la página específica
    } else {
        console.error('Error:', error);
    }
    throw error; // Opcional: Lanza el error para manejarlo en otras partes
};

export async function getTiposUtensilio() {
    try {
        const { data } = await axios.get('/utensilios/tipo/');
        return data.data;
    } catch (error) {
        console.error('Error al traer los tipos utensilios:', error);
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data || [];
    }
}

export async function updateTipoUtensilio(data, id) {
    try {
        const response = await axios.patch(`/utensilios/tipo/${id}`, data);
        return response.data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.error('Error al actualizar un tipo de utensilios:', error);
        console.log(error);
        return error.response.data || [];
    }
}

export async function deleteTipoUtensilio(id) {
    try {
        const response = await axios.delete(`/utensilios/tipo/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar un tipo utensilio:', error);
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data || [];
    }
}
export async function createTipoUtensilio(data) {
    try {
        const response = await axios.post(`/utensilios/tipo/`, data)
        return response.data
    }catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.error('Error al crear un tipo utensilio:', error);
        console.log(error)
        return error.response.data || [];
    }
}
export async function getUtensilio(id) {
    try {
        const { data } = await axios.get(`/utensilios/${id}`);
        return data.data;
    } catch (error) {
        console.error('Error al traer un utensilio:', error);
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data || [];
    }
}
export async function getUtensilios() {
    try {
        const { data } = await axios.get(`/utensilios/`);
        return data.data;
    } catch (error) {
        console.error('Error al traer los utensilios:', error);
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data || [];
    }
}
export async function getUtensiliosDetallado() {
    try {
        const { data } = await axios.get(`/utensilios/detallado/detallado`);
        return data.data;
    } catch (error) {
        console.error('Error al traer los utensilios:', error);
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data || [];
    }
}
export async function createUtensilio(utensilio) {
    try {
        const { data } = await axios.post('/utensilios/', utensilio);
        return data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.error('Error al crear utensilios:', error);
        return error.response.data || [];
    }
}
export async function updateUtensilio(utensilio, id) {
    try {
        const { data } = await axios.patch(`/utensilios/${id}`, utensilio);
        return data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.error('Error al actualizar utensilios:', error);
        return error.response.data || [];
    }
}
export async function deleteUtensilio(id) {
    try {
        await axios.delete(`/utensilios/${id}`);
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.error('Error eliminando el utensilio:', error);
        return error.response.data || [];
    }
}