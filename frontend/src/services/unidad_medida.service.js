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


export async function getUnidadesMedidas() {
    try {
        const { data } = await axios.get('unidades-medidas/');
        //const formattedData = data.data.map(formatUserData);
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}
export async function getUnidadMedidaById(id) {
    try {
        const response = await axios.get(`unidades-medidas/${id}`);
        return response.data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}

export async function updateUnidadMedida(data, id) {
    try {
        const response = await axios.patch(`unidades-medidas/${id}`, data, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Captura el mensaje del backend
            throw new Error(error.response.data.message);
        } else {
            handleErrorResponse(error);
        }
    }
}



export async function deleteUnidadMedida(id) {
    try {
        const response = await axios.delete(`unidades-medidas/${id}`);
        return response.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}
export async function createUnidadMedida(data) {
    try {
        const response = await axios.post(`unidades-medidas/`, data);
        return response.data; // Éxito
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            // Captura el mensaje de error del backend
            throw new Error(error.response.data.message);
        } else {
            handleErrorResponse(error); // Maneja otros errores
        }
    }
}
