import axios from './root.service.js';


export async function getUnidadesMedidas() {
    try {
        const { data } = await axios.get('unidades-medidas/');
        console.log(data.data)
        //const formattedData = data.data.map(formatUserData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function getUnidadMedidaById(id) {
    try {
        const response = await axios.get(`unidades-medidas/${id}`);
        return response.data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateUnidadMedida(data, id) {
    try {
        const response = await axios.patch(`unidades-medidas/${id}`, data, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        console.log('Respuesta del backend:', response.data); // Debug
        return response.data.data;
    } catch (error) {
        console.error('Error al enviar PATCH:', error.response || error);
        throw new Error(
            error.response?.data?.message || 'Error desconocido al actualizar la unidad de medida.'
        );
    }
}


export async function deleteUnidadMedida(id) {
    try {
        const response = await axios.delete(`unidades-medidas/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createUnidadMedida(data) {
    try {
        const response = await axios.post(`unidades-medidas/`, data)
        return response.data
    }catch (error) {
        console.log(error)
        return error.response.data;
    }
}