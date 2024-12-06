import axios from './root.service.js';

export async function getTiposUtensilio() {
    try {
        const { data } = await axios.get('/utensilios/tipo/');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateTipoUtensilio(data, id) {
    try {
        const response = await axios.patch(`/utensilios/tipo/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteTipoUtensilio(id) {
    try {
        const response = await axios.delete(`/utensilios/tipo/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function createTipoUtensilio(data) {
    try {
        const response = await axios.post(`/utensilios/tipo/`, data)
        return response.data
    }catch (error) {
        console.log(error)
        return error.response.data;
    }
}
export async function getUtensilio(id) {
    try {
        const { data } = await axios.get(`/utensilios/${id}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function getUtensilios() {
    try {
        const { data } = await axios.get(`/utensilios/`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}