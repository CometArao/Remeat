import axios from './root.service.js';


export async function getUnidadMedida() {
    try {
        const { data } = await axios.get('/utensilios/tipo/');
        console.log(data.data)
        //const formattedData = data.data.map(formatUserData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateUnidadMedida(data, id) {
    try {
        const response = await axios.patch(`/utensilios/tipo/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUnidadMedida(id) {
    try {
        const response = await axios.delete(`/utensilios/tipo/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createUnidadMedida(data) {
    try {
        const response = await axios.post(`/utensilios/tipo/`, data)
        return response.data
    }catch (error) {
        console.log(error)
        return error.response.data;
    }
}