import axios from './root.service';

export const createComanda = async (comandaData, token) => {
  const response = await axios.post('/comandas', comandaData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteComanda = async (id, token) => {
  await axios.delete(`/comandas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

export const updateComanda = async (comandaId, comandaData, token) => {
  const response = await axios.put(
    `/comandas/${comandaId}`,
    comandaData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
