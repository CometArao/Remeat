import axios from './root.service.js';


export async function getUnidadMedida() {
    try {
        const { data } = await axios.get('api/unidades-medidas/');
        console.log(data.data)
        //const formattedData = data.data.map(formatUserData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateUnidadMedida(data, id) {
    try {
        const response = await axios.patch(`api/unidades-medidas/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUnidadMedida(id) {
    try {
        const response = await axios.delete(`api/unidades-medidas/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createUnidadMedida(data) {
    try {
        const response = await axios.post(`api/unidades-medidas/`, data)
        return response.data
    }catch (error) {
        console.log(error)
        return error.response.data;
    }
}