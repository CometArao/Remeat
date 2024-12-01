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

export const getTipoIngrediente = async (tipoIngredienteId) => {
    try {
        const response = await axios.get(`/ingredientes/tipo/${tipoIngredienteId}`)
        console.log(response)
        return response.data;
    }catch (error) {
        console.error('Error borrando ingrediente:', error);
    }
}

export const getTiposIngrediente = async () => {
    try {
        console.log("getTiposIngredientes")
        const response = await axios.get(`/ingredientes/tipo/`)
        console.log("response")
        console.log(response)
        return response.data;
    }catch (error) {
        console.error('Error borrando ingrediente:', error);
    }
}
export const updateTipoIngrediente = async (tipoIngredienteId) => {
    try {
        const response = await axios.patch(`/api/ingredientes/tipo/${tipoIngredienteId}`)
        return response.data;
    }catch (error) {
        console.error('Error borrando ingrediente:', error);
    }
}
export const deleteTipoIngrediente = async (tipoIngredienteId) => {
    try {
        const response = await axios.delete(`/api/ingredientes/tipo/${tipoIngredienteId}`)
        return response.data;
    }catch (error) {
        console.error('Error borrando ingrediente:', error);
    }
}