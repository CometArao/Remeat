import axios from './root.service.js'

export async function getmermas() {
    try {
        const { data } = await axios.get('/mermas/get_all_mermas')
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}
export async function getmerma(id) {
    try {
        const { data } = await axios.get(`/get_merma/${id}`)
        return data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}
export async function crearMerma(datos) {
    try {
        const response = await axios.post('/mermas/create_merma', datos);
        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data;
    }
}
export async function updateMerma(id, datos) {
    try {
        const response = await axios.post(`/mermas/update_merma/${id}`, datos);
        return response.data;
    } catch (error) {
        console.log(error)
        return error.response.data;
    }
}
export async function deleteMerma(id) {
    try {
        const response = await axios.post(`/mermas/delete_merma/${id}`);
        return response.data;
    }catch(error) {
        console.log(error);
        return error.response.data;
    }
}