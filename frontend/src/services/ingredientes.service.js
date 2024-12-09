import axios from './root.service.js';

export async function getIngredientes() {
    try {
        const { data } = await axios.get('/ingredientes/');
        return data.data;
    } catch (error) {
        console.error('Error fetching ingredientes:', error);
        return [];
    }
}


export async function createIngrediente(data) {
    try {
        const response = await axios.post('/ingredientes/', data, {
            headers: {
                'Cache-Control': 'no-cache', // Desactiva el uso de caché
                'Pragma': 'no-cache', // Asegura compatibilidad
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Error creating ingrediente:', error);
        return error.response.data;
    }
}

export async function updateIngrediente(data, id) {
    try {
        const response = await axios.put(`/ingredientes/${id}`, data, {
            headers: { 'Cache-Control': 'no-cache', // Desactiva el uso de caché
                        'Pragma': 'no-cache',       // Asegura compatibilidad
             },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating ingrediente:', error);
        return error.response.data;
    }
}

export async function deleteIngrediente(id) {
    try {
        if (!id) throw new Error('ID no válida para eliminar el ingrediente.');

        const response = await axios.delete(`/ingredientes/${id}`, {
            headers: { 'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
             },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting ingrediente:', error);
        return error.response.data;
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

export async function createTipoIngrediente(data) {
    try {
        const response = await axios.post('/ingredientes/tipo/', data, );
        return response.data;
    } catch (error) {
        console.error('Error creating tipo ingrediente:', error);
        return error.response.data;
    }
}


export async function updateTipoIngrediente(data, id) {
    try {
        const response = await axios.patch(`/ingredientes/tipo/${id}`, data, {
            headers: { 'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
             },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tipo ingrediente:', error);
        return error.response.data 
    }
}


export async function deleteTipoIngrediente(id) {
    try {
      if (!id) throw new Error('ID no válida para eliminar el tipo de ingrediente.');
  
      // Envía la solicitud DELETE con encabezados mínimos
      const response = await axios.delete(`/ingredientes/tipo/${id}`, {
        headers: { 'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
         }, // Evita el uso de caché
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting tipo ingrediente:', error);
      return error.response.data;
    }
  }
  
