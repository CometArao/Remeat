import axios from './root.service.js';

export async function getPlatillos() {
    try {
        const { data } = await axios.get('/platillos/');
        console.log(data.data)
        //const formattedData = data.data.map(formatUserData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}