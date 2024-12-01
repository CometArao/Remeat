import axios from './root.service.js';

export const getIngredientes = async () => {
 try {
    const response = await axios.get('/api/ingredientes');
    return response.data;
 } catch (error) {
    console.error('Error fetching ingredientes:', error);
    
 }
};



export const createIngrediente = async (ingredienteData) => {
try {
    const response = await axios.post('/api/ingredientes', ingredienteData);
    return response.data;
  } catch (error) {
    console.error('Error creating ingrediente:', error);
  }
};

export const updateIngrediente = async (ingredienteData) => {
    try {
        const response = await axios.put(`/api/ingredientes/${ingredienteData.id}`, ingredienteData);
        return response.data;
    } catch (error) {
        console.error('Error updating ingrediente:', error);
        
    }

};

export const deleteIngrediente = async (ingredienteId) => {
    try {
        const response =  await axios.delete(`/api/ingredientes/${ingredienteId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ingrediente:', error);
        
    }

};

export async function getTiposIngrediente() {
    try {
        const { data } = await axios.get('/ingredientes/tipo/');
        return data.data;
    } catch (error) {
        console.error('Error fetching tipos de ingrediente:', error);
        return error.response.data;
    }
}

export async function createTipoIngrediente(tipoIngrediente) {
    try {
        const { data } = await axios.post('/ingredientes/tipo/', tipoIngrediente);
        return data.data;
    } catch (error) {
        console.error('Error creating tipo ingrediente:', error);
        return error.response.data;
    }
}

export async function updateTipoIngrediente(tipoIngrediente, id) {
    try {
        const { data } = await axios.patch(`/ingredientes/tipo/${id}`, tipoIngrediente);
        return data.data;
    } catch (error) {
        console.error('Error updating tipo ingrediente:', error);
        return error.response.data;
    }
}

export async function deleteTipoIngrediente(id) {
    try {
        const { data } = await axios.delete(`/ingredientes/tipo/${id}`);
        return data;
    } catch (error) {
        console.error('Error deleting tipo ingrediente:', error);
        return error.response.data;
    }
}