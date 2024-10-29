// backend/src/controllers/comanda.controller.js
import {
    createComanda,
    getComandasByMesero,
    updateComanda,
    deleteComanda,
    completeComanda,
  } from '../services/comanda.service.js';
  import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js';
  
  export async function createComandaController(req, res) {
    
    const meseroId = req.user.id;
  
    try {
      const newComanda = await createComanda(meseroId);
      handleSuccess(res, 201, 'Comanda creada', newComanda);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
  
  export async function getComandasController(req, res) {
    const meseroId = req.user.id;
  
    try {
      const comandas = await getComandasByMesero(meseroId);
      handleSuccess(res, 200, 'Comandas obtenidas', comandas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
  
  export async function updateComandaController(req, res) {

    const comandaId = req.params.id;
  
    try {
      const updatedComanda = await updateComanda(comandaId);
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
  