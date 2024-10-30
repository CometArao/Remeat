// backend/src/controllers/comanda.controller.js
import {
  createComanda,
  getComandaById,
  updateComanda,
  deleteComanda,
  completeComanda,
  getAllComandas,
  addPlatilloToComanda,
} from '../services/comanda.service.js';
import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

export async function addPlatilloToComandaController(req, res) {
  const comandaId = req.params.id;
  const platilloData = req.body;

  try {
    const addedPlatillo = await addPlatilloToComanda(comandaId, platilloData);
    handleSuccess(res, 201, 'Platillo añadido a la comanda', addedPlatillo);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, error.message);
    }
  }
}


export async function createComandaController(req, res) {
  const data = req.body;

  try {
      const newComanda = await createComanda(data);
      handleSuccess(res, 201, 'Comanda creada', newComanda);
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}

export async function getAllComandasController(req, res) {
  try {
      const comandas = await getAllComandas();
      handleSuccess(res, 200, 'Comandas obtenidas', comandas);
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}

export async function getComandaByIdController(req, res) {
  const comandaId = req.params.id;

  try {
      const comanda = await getComandaById(comandaId);
      if (comanda) {
          handleSuccess(res, 200, 'Comanda obtenida', comanda);
      } else {
          handleErrorClient(res, 404, 'Comanda no encontrada');
      }
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}

export async function updateComandaController(req, res) {
  const comandaId = req.params.id;
  const data = req.body;

  try {
      const updatedComanda = await updateComanda(comandaId, data);
      handleSuccess(res, 200, 'Comanda actualizada', updatedComanda);
  } catch (error) {
      handleErrorClient(res, 400, error.message);
  }
}

export async function deleteComandaController(req, res) {
  const comandaId = req.params.id;

  try {
      const deletedComanda = await deleteComanda(comandaId);
      handleSuccess(res, 200, 'Comanda eliminada', deletedComanda);
  } catch (error) {
      handleErrorClient(res, 404, error.message);
  }
}



export async function completeComandaController(req, res) {
  const comandaId = req.params.id;

  try {
      const completedComanda = await completeComanda(comandaId);
      handleSuccess(res, 200, 'Comanda completada', completedComanda);
  } catch (error) {
      handleErrorClient(res, 400, error.message);
  }
}
