import axios from './root.service.js';

// Redirigir al usuario a una página específica en caso de error
const handleErrorResponse = (error) => {
    if (error.response?.status === 403) {
        console.warn('Acceso denegado: fuera de horario laboral.');
        window.location.href = '/fuera-horario'; // Redirige a la página específica
    } else {
        console.error('Error:', error);
    }
    throw error; // Opcional: Lanza el error para manejarlo en otras partes
};

export async function getIngredientes() {
    try {
        const { data } = await axios.get('/ingredientes/');
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}
export async function getIngredietnesDetallado() {
    try {
        const { data } = await axios.get('/ingredientes/detallado/detallado');
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
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
        handleErrorResponse(error); // Maneja el error aquí
        return [];
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
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}

export async function deleteIngrediente(id_ingrediente) {
    try {
        if (!id_ingrediente) throw new Error('ID no válida para eliminar el ingrediente.');

        const response = await axios.delete(`/ingredientes/${id_ingrediente}`, {
            headers: { 'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
             },
        });
        return response.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}

export async function getTiposIngrediente() {
    try {
        const { data } = await axios.get('/ingredientes/tipo/');
        return data.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}

export async function createTipoIngrediente(data) {
    try {
        const response = await axios.post('/ingredientes/tipo/', data, );
        return response.data;
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
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
        handleErrorResponse(error); // Maneja el error aquí
        return [];
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
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
  }
  
