import axios from './root.service';

export const createComanda = async (data, token) => {
  try {
    const response = await axios.post('/comandas', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data || new Error('Error desconocido al crear la comanda.');
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
  } catch (err) {
    console.error('Error en la solicitud de eliminación:', err.response || err);
    throw new Error(err.response?.data?.message || 'Error al eliminar la comanda.');
  }
};

export const getComandas = async (token) => {
  const response = await axios.get('/comandas', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addPlatilloToComanda = async (comandaId, platilloData, token) => {
  const response = await axios.post(
    `/comandas/${comandaId}/platillos`,
    platilloData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getComandasWithPlatillos = async (token) => {
  const response = await axios.get('/comandas/comandas/platillos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



export const completeComanda = async (comandaId, token) => {
  const response = await axios.patch(
    `/comandas/${comandaId}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};



export const getComandaById = async (id, token) => {
  try {
    const response = await axios.get(`/comandas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error('Error obteniendo la comanda por ID:', err.response || err);
    throw new Error(err.response?.data?.message || 'Error al obtener la comanda.');
  }
};

export const getMeseros = async (id, token) => {
  try {
    const response = await axios.get(`/comandas/comanda/meseros`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error('Error obteniendo los meseros:', err.response || err);
    throw new Error(err.response?.data?.message || 'Error al obtener los meseros.');
  }
};



export const getPlatillos = async (id, token) => {
  try {
    const response = await axios.get(`/comandas/comanda/menuplatillo`, {
      headers: { Authorization: `Bearer ${token}` },
    });    
    return response.data;
    
  } catch (err) {
    console.error('Error obteniendo los platillos:', err.response || err);
    throw new Error(err.response?.data?.message || 'Error al obtener los platillos.');
  }
};


export const removePlatilloFromComanda = async (comandaId, platilloId, token) => {
  const response = await axios.delete(`/comandas/${comandaId}/platillos/${platilloId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};