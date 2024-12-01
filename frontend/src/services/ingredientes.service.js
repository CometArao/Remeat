import axios from './root.service.js';

export async function getIngredientes() {
    try {
        const { data } = await axios.get('/ingredientes/');
        return data.data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return error.response.data || [];
    }
}

export async function createIngrediente(ingrediente) {
    try {
        const { data } = await axios.post('/ingredientes/', ingrediente, {
            headers: {
                'Cache-Control': 'no-cache', // Desactiva el uso de caché
                'Pragma': 'no-cache', // Asegura compatibilidad
            },
        });
        
        return data.data;
    } catch (error) {
        console.error('Error creating ingrediente:', error);
        return error.response.data;
    }
}

export async function updateIngrediente(ingrediente, id) {
    try {
        const { data } = await axios.put(`/ingredientes/${id}`, ingrediente);
        return data.data;
    } catch (error) {
        console.error('Error updating ingrediente:', error);
        return error.response.data;
    }
}

export async function deleteIngrediente(id) {
    try {
        if (!id) throw new Error('ID no válida para eliminar el ingrediente.');

        const { data } = await axios.delete(`/ingredientes/${id}`, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        return data;
    } catch (error) {
        console.error('Error deleting ingrediente:', error);
        return error.response?.data || { status: 'Client error', details: error.message };
    }
}

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
        const { data } = await axios.patch(`/ingredientes/tipo/${id}`, tipoIngrediente, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        return data.data;
    } catch (error) {
        console.error('Error updating tipo ingrediente:', error);
        return error.response?.data || { error: 'Error desconocido' };
    }
}


export async function deleteTipoIngrediente(id) {
    try {
      if (!id) throw new Error('ID no válida para eliminar el tipo de ingrediente.');
  
      // Envía la solicitud DELETE con encabezados mínimos
      const { data } = await axios.delete(`/ingredientes/tipo/${id}`, {
        headers: { 'Cache-Control': 'no-cache' }, // Evita el uso de caché
      });
      return data;
    } catch (error) {
      console.error('Error deleting tipo ingrediente:', error);
      return error.response?.data || { status: 'Client error', details: error.message };
    }
  }
  
