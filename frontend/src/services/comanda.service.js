import axios from './root.service';


const handleErrorResponse = (error) => {
  if (error.response?.status === 403) {
    console.warn('Acceso denegado: fuera de horario laboral.');
    window.location.href = '/fuera-horario'; 
  } else if (error.response?.data?.message) {
    console.error('Error del backend:', error.response.data.message);
    throw new Error(error.response.data.message); 
  } else {
    console.error('Error desconocido:', error);
    throw new Error('Ocurrió un error inesperado.'); 
  }
};

export const createComanda = async (data, token) => {
  try {
    const response = await axios.post('/comandas', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error); 
    return [];
  }
};

export const deleteComanda = async (id, token) => {
  try {
    const response = await axios.delete(`/comandas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en los headers
      },
    });
    return response.data; // Asegúrate de devolver los datos esperados
  } catch (error) {
    handleErrorResponse(error); 
    return [];
  }
};

export const getComandas = async (token) => {
  try {
    const response = await axios.get('/comandas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};

export const addPlatilloToComanda = async (comandaId, platilloData, token) => {
  try {
    const response = await axios.post(
      `/comandas/${comandaId}/platillos`,
      platilloData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};

export const getComandasWithPlatillos = async (token) => {
  try {
    const response = await axios.get('/comandas/comandas/platillos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};



export const completeComanda = async (comandaId, token) => {
  try {
    const response = await axios.patch(
      `/comandas/${comandaId}/complete`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};



export const getComandaById = async (id, token) => {
  try {
    const response = await axios.get(`/comandas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};



export const getPlatillos = async (token) => {
  try {
    const response = await axios.get(`/comandas/comanda/menuplatillo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};


export const removePlatilloFromComanda = async (comandaId, platilloId, token) => {
  try {
    const response = await axios.delete(
      `/comandas/${comandaId}/platillos/${platilloId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    return [];
  }
};