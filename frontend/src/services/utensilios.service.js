import axios from './root.service.js';

// Tipo Utensilios
export async function getTiposUtensilio() {
    try {
        const { data } = await axios.get('/utensilios/tipo/');
        return data.data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function createTipoUtensilio(tipoUtensilio) {
    try {
        const { data } = await axios.post('/utensilios/tipo/', tipoUtensilio);
        return data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function updateTipoUtensilio(tipoUtensilio, id) {
    try {
        const { data } = await axios.patch(`/utensilios/tipo/${id}`, tipoUtensilio);
        return data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function deleteTipoUtensilio(id) {
    try {
        await axios.delete(`/utensilios/tipo/${id}`);
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

// Utensilios
export async function getUtensilios() {
    try {
        const { data } = await axios.get('/utensilios/');
        return data.data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function createUtensilio(utensilio) {
    try {
        const { data } = await axios.post('/utensilios/', utensilio);
        return data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function updateUtensilio(utensilio, id) {
    try {
        const { data } = await axios.patch(`/utensilios/${id}`, utensilio);
        return data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function deleteUtensilio(id) {
    try {
        await axios.delete(`/utensilios/${id}`);
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}
