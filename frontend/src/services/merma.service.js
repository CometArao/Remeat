import axios from './root.service.js'

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

export async function getmermas() {
    try {
        const { data } = await axios.get('/mermas/get_all_mermas')
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return error.response.data;
    }
}
export async function getmerma(id) {
    try {
        const { data } = await axios.get(`/mermas/get_merma${id}`)
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.log(error);
        return error.response.data;
    }
}
export async function crearMerma(datos) {
    try {
        const response = await axios.post('/mermas/create_merma', datos);
        return response.data
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.log(error)
        return error.response.data;
    }
}
export async function updateMerma(id, datos) {
    try {
        const response = await axios.post(`/mermas/update_merma/${id}`, datos);
        return response.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.log(error)
        return error.response.data;
    }
}
export async function deleteMerma(id) {
    try {
        const response = await axios.delete(`/mermas/delete_merma${id}`);
        return response.data;
    }catch(error) {
        handleErrorResponse(error); // Maneja el error aquí
        console.log(error);
        return error.response.data;
    }
}