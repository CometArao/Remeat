import axios from 'axios';

export const createComanda = async (comandaData, token) => {
  const response = await axios.post('http://localhost:3000/api/comandas', comandaData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteComanda = async (id, token) => {
  await axios.delete(`http://localhost:3000/api/comandas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getComandas = async (token) => {
  const response = await axios.get('http://localhost:3000/api/comandas', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addPlatilloToComanda = async (comandaId, platilloData, token) => {
  const response = await axios.post(
    `http://localhost:3000/api/comandas/${comandaId}/platillos`,
    platilloData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getComandasWithPlatillos = async (token) => {
  const response = await axios.get('http://localhost:3000/api/comandas/comandas/platillos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const updateComanda = async (comandaId, comandaData, token) => {
  const response = await axios.put(
    `http://localhost:3000/api/comandas/${comandaId}`,
    comandaData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const completeComanda = async (comandaId, token) => {
  const response = await axios.patch(
    `http://localhost:3000/api/comandas/${comandaId}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
