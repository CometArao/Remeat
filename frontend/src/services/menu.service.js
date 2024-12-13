import axios from './root.service';


export async function getMenus() {
  try {
    const response = await axios.get('/menus/');
    console.log(response);
    const data = response.data; // Acceder directamente a response.data
    console.log('Data:', data);
    return data.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getMenuById(id) {
  try {
    const response = await axios.get(`menus/${id}`);
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function createMenu(data) {
  try {
    const response = await axios.post('menus/', data);
    return response.data.data; // Devuelve los datos del backend en caso de éxito
  } catch (error) {
    // Lanza el error capturado para que pueda ser manejado en el componente
    throw error.response?.data || new Error("Ocurrió un error desconocido al crear el menú.");
  }
}


export async function updateMenu(data, id) {
  try {
    console.log('Datos enviados:', data, 'ID:', id);

    // Llama al endpoint relativo (baseURL se aplica automáticamente)
    const response = await axios.patch(`menus/${id}`, data, {
      headers: { 'Cache-Control': 'no-cache' },
    });

    console.log('Respuesta del backend:', response.data); // Debug
    return response.data.data; // Devuelve los datos del backend
  } catch (error) {
    console.error('Error al enviar PATCH:', error.response?.data || error.message);
    // Manejo de errores con un mensaje claro
    throw new Error(
      error.response?.data?.message || 'Error desconocido al actualizar el menú.'
    );
  }
}

export async function deleteMenu(id) {
  try {
    const response = await axios.delete(`menus/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function activateMenu(id) {
  try {
    const response = await axios.patch(`menus/activar/${id}`);
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
}