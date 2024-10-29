"use strict";
import { AppDataSource } from "../config/configDb.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Controlador para crear un tipo de ingrediente
export async function createTipoIngrediente(req, res) {
  try {
    const tipoIngredienteRepo = AppDataSource.getRepository(TipoIngrediente);
    const newTipoIngrediente = tipoIngredienteRepo.create(req.body);
    await tipoIngredienteRepo.save(newTipoIngrediente);
    handleSuccess(res, 201, "Tipo de ingrediente creado exitosamente", newTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los tipos de ingredientes
export async function getTipoIngredientes(req, res) {
  try {
    const tipoIngredienteRepo = AppDataSource.getRepository(TipoIngrediente);
    const tipos = await tipoIngredienteRepo.find();
    handleSuccess(res, 200, "Tipos de ingredientes obtenidos", tipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para actualizar un tipo de ingrediente
export async function updateTipoIngrediente(req, res) {
  try {
    const { id } = req.params;
    const tipoIngredienteRepo = AppDataSource.getRepository(TipoIngrediente);
    await tipoIngredienteRepo.update(id, req.body);
    const updatedTipoIngrediente = await tipoIngredienteRepo.findOneBy({ id_tipo_ingrediente: id });
    handleSuccess(res, 200, "Tipo de ingrediente actualizado exitosamente", updatedTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un tipo de ingrediente
export async function deleteTipoIngrediente(req, res) {
  try {
    const { id } = req.params;
    const tipoIngredienteRepo = AppDataSource.getRepository(TipoIngrediente);
    await tipoIngredienteRepo.delete(id);
    handleSuccess(res, 200, "Tipo de ingrediente eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para crear un ingrediente
export async function createIngrediente(req, res) {
  try {
    const ingredienteRepo = AppDataSource.getRepository(Ingrediente);
    const newIngrediente = ingredienteRepo.create(req.body);
    await ingredienteRepo.save(newIngrediente);
    handleSuccess(res, 201, "Ingrediente creado exitosamente", newIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los ingredientes
export async function getIngredientes(req, res) {
  try {
    const ingredienteRepo = AppDataSource.getRepository(Ingrediente);
    const ingredientes = await ingredienteRepo.find({ relations: { tipo_ingrediente: true } });
    handleSuccess(res, 200, "Ingredientes obtenidos", ingredientes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para actualizar un ingrediente
export async function updateIngrediente(req, res) {
  try {
    const { id } = req.params;
    const ingredienteRepo = AppDataSource.getRepository(Ingrediente);
    await ingredienteRepo.update(id, req.body);
    const updatedIngrediente = await ingredienteRepo.findOneBy({ id_ingrediente: id });
    handleSuccess(res, 200, "Ingrediente actualizado exitosamente", updatedIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un ingrediente
export async function deleteIngrediente(req, res) {
  try {
    const { id } = req.params;
    const ingredienteRepo = AppDataSource.getRepository(Ingrediente);
    await ingredienteRepo.delete(id);
    handleSuccess(res, 200, "Ingrediente eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
