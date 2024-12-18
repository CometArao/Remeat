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

export async function getPlatillos() {
    try {
        const response = await axios.get('/platillos/');
        console.log(response);
        const data = response.data; // Acceder directamente a response.data
        console.log('Data:', data);
        return data.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function getPlatilloById(id) {
    try {
        const response = await axios.get(`platillos/${id}`);
        return response.data.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function createPlatillo(data, token) {
    try {
        const response = await axios.post('platillos/', data,
            {
                headers: {  
                  'Authorization': `Bearer ${token}`,
                  'Cache-Control': 'no-cache',

                },
            }
        );

        return response.data.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function updatePlatillo(data, id) {
    try {
        console.log('Datos enviados:', data, 'ID:', id);

        console.log("Servicio front")
      // Llama al endpoint relativo (baseURL se aplica automáticamente)
      const response = await axios.patch(`platillos/${id}`, data, {
        headers: { 'Cache-Control': 'no-cache' },
      });
  
      console.log('Respuesta del backend:', response.data); // Debug
      return response.data.data; // Devuelve los datos del backend
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function updatePlatilloPrice(id, newPrice) {
  try {
      const response = await axios.patch(`platillos/cambiar-precio/${id}`, { precio_platillo: newPrice }, {
          headers: { 'Cache-Control': 'no-cache' },
      });
      return response.data.data; // Devuelve los datos del backend
  } catch (error) {
    handleErrorResponse(error); // Maneja el error aquí
    return [];
}
}
  

export async function deletePlatillo(id) {
    try {
        const response = await axios.delete(`platillos/${id}`);
        return response.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function getFilteredTipoIngredientes() {
    try {
        const response = await axios.get('/platillos/ingredientes/tipo');
        return response.data.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}

export async function confirmarPlatillo(idPlatillo, idComanda, nuevoEstado) {
    try {
      const response = await axios.post(
        `/platillos/confirmar/${idPlatillo}/${idComanda}`,
        { nuevo_estado: nuevoEstado },
      );
      return response.data;
    } catch (error) {
      handleErrorResponse(error); // Maneja el error aquí
      return [];
  }
}