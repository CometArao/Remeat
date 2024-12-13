// backend/src/controllers/comanda.controller.js
import {
  createComanda,
  getComandaById,
  updateComanda,
  deleteComanda,
  completeComanda,
  getAllComandas,
  addPlatilloToComanda,
  obtenerComandasConPlatillos,
  getMeserosService,
  getPlatillosDelDiaService,
  removePlatilloFromComanda
} from '../services/comanda.service.js';

import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

import {
  createComandaValidation,
  addPlatilloToComandaValidation,
  updateComandaValidation
} from '../validations/comanda.validation.js';










export async function removePlatilloFromComandaController(req, res) {
  const comandaId = parseInt(req.params.id, 10);
  const platilloId = parseInt(req.params.platilloId, 10);
  const loggedUser = req.user; // Usuario logueado, obtenido del middleware de autenticación

  try {
    const result = await removePlatilloFromComanda(comandaId, platilloId, loggedUser);
    res.status(200).json({ status: 'Success', message: result.message });
  } catch (error) {
    if (error.message.includes('No tienes permiso') || error.message.includes('estado "pendiente"')) {
      res.status(403).json({ status: 'Error', message: error.message });
    } else {
      res.status(400).json({ status: 'Error', message: error.message });
    }
  }
}













export async function getMeserosController(req, res){
  try {
    // Llama al servicio para obtener la lista de meseros
    const meseros = await getMeserosService();

    // Devuelve la lista de meseros con un estado 200
    res.status(200).json({ status: 'Success', data: meseros });
  } catch (error) {
    // En caso de error, devuelve un estado 500 y el mensaje de error
    res.status(500).json({ status: 'Error', message: error.message });
  }
};




export async function getPlatillosDelDiaController(req, res){
  try {
    const platillos = await getPlatillosDelDiaService(); // Llama al servicio para obtener los platillos
    res.status(200).json({ status: 'Success', data: platillos });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};






export async function getComandasConPlatillosController(req, res) {
  try {
      const respuesta = await obtenerComandasConPlatillos();
      handleSuccess(res, 200, 'Comandas obtenidas con estado de platillos', respuesta.data); // Usa respuesta.data
  } catch (error) {
      handleErrorServer(res, 500, error.message);
  }
}





export async function addPlatilloToComandaController(req, res) {
  const { error } = addPlatilloToComandaValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.details[0].message);

  const comandaId = req.params.id;
  try {
    const addedPlatillo = await addPlatilloToComanda(comandaId, req.body);
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
  try {
    // Suponiendo que `req.user` contiene el usuario logueado
    const loggedUser = req.user;
    console.log(loggedUser);

    const newComanda = await createComanda(loggedUser);
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
  const { error } = updateComandaValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.details[0].message);

  const comandaId = req.params.id;
  try {
    const updatedComanda = await updateComanda(comandaId, req.body);
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
      if (error.message.includes('no encontrada')) {
          handleErrorClient(res, 404, error.message);
      } else {
          handleErrorServer(res, 500, error.message);
      }
  }
}



export async function completeComandaController(req, res) {
  const comandaId = req.params.id;

  try {
    const completedComanda = await completeComanda(comandaId);
    handleSuccess(res, 200, 'Comanda completada', completedComanda);
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorClient(res, 400, error.message);
    }
  }
}