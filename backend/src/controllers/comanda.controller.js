// backend/src/controllers/comanda.controller.js
import {
  createComanda,
  getComandaById,
  deleteComanda,
  completeComanda,
  getAllComandas,
  addPlatilloToComanda,
  obtenerComandasConPlatillos,
  getPlatillosDelDiaService,
  removePlatilloFromComanda
} from '../services/comanda.service.js';

import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';

import {
  createComandaValidation,
  addPlatilloToComandaValidation,
  deleteComandaValidation,
  completeComandaValidation,
  removePlatilloFromComandaValidation,

} from '../validations/comanda.validation.js';

import { sendNotification } from '../services/socket.js';



export async function removePlatilloFromComandaController(req, res) {
  const comandaId = parseInt(req.params.id, 10);
  const platilloId = parseInt(req.params.platilloId, 10);
  const loggedUser = req.user; // Usuario logueado, obtenido del middleware de autenticación


  const { error } = removePlatilloFromComandaValidation.validate({
    id_comanda: comandaId,
    id_platillo: platilloId
  });

  if (error) {
    return res.status(400).json({
      status: 'Error',
      message: error.details[0].message
    });
  }

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
  console.log('Comanda ID:', req.params.id);
  console.log('Platillo ID:', req.params.platilloId);

}


export async function getPlatillosDelDiaController(req, res) {
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
  if (error) {
    return res.status(400).json({
      status: 'Error',
      message: error.details[0].message
    });
  }

  const comandaId = req.params.id;
  try {
    const addedPlatillo = await addPlatilloToComanda(comandaId, req.body);
    handleSuccess(res, 201, 'Platillo añadido a la comanda', addedPlatillo);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      handleErrorClient(res, 404, error.message);
    } else if (error.message.includes('completada')) { 
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, error.message);
    }
  }
}



export async function createComandaController(req, res) {
  const { error } = createComandaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'Error',
        message: error.details[0].message
      });
    }
  
  try {

    const loggedUser = req.user;
    const platilloData = req.body.platillo;

    if (!platilloData || !platilloData.nombre_platillo || !platilloData.cantidad) {
      return res.status(400).json({
        status: 'Error',
        message: 'Debe proporcionar un nombre y cantidad para el platillo.'
      });
    }

    const newComanda = await createComanda(loggedUser, platilloData);

    sendNotification('nueva-comanda', {
      id_comanda: newComanda.id_comanda,
      fecha: newComanda.fecha_compra_comanda,
      hora: newComanda.hora_compra_comanda,
      estado: newComanda.estado_comanda,
    });



    res.status(201).json({
      status: 'Success',
      message: 'Comanda creada con éxito.',
      data: newComanda,
    });
  } catch (error) {
    console.error('Error en createComandaController:', error.message);
    res.status(500).json({ status: 'Error', message: error.message });
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






export async function deleteComandaController(req, res) {
  const comandaId = req.params.id;

  try {

    const comanda = await getComandaById(comandaId);
    const { error } = deleteComandaValidation.validate({ estado_comanda: comanda.estado_comanda });
    if (error) {
      return res.status(400).json({
        status: 'Error',
        message: error.details[0].message
      });
    }


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

  const { error } = completeComandaValidation.validate({ id: comandaId });
  if (error) {
    return res.status(400).json({
      status: 'Error',
      message: error.details[0].message
    });
  }

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