"use strict";
import { 
    createTipoIngredienteService, 
    getTipoIngredientesService,
    getTipoIngredienteByIdService, 
    updateTipoIngredienteService,
    deleteTipoIngredienteService,
    createIngredienteService,
    getIngredientesService,
    getIngredienteByIdService,
    updateIngredienteService,
    deleteIngredienteService 
       } from "../services/ingrediente.service.js";

import { 
      tipoIngredienteBodyValidation,
      tipoIngredienteQueryValidation,
      ingredienteBodyValidation,
      ingredienteQueryValidation 
        } from "../validations/ingrediente.validation.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Controlador para crear un tipo de ingrediente
export async function createTipoIngrediente(req, res) {
  try {
    const { nombre_tipo_ingrediente } = req.body;
    const { error } = tipoIngredienteBodyValidation.validate({ nombre_tipo_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [newTipoIngrediente, errorTipoIngrediente] = await createTipoIngredienteService({ nombre_tipo_ingrediente });
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 400, "Error creando tipo de ingrediente", errorTipoIngrediente);
    }
    handleSuccess(res, 201, "Tipo de ingrediente creado exitosamente", newTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los tipos de ingredientes
export async function getTipoIngredientes(req, res) {
  try {
    const [tipos, error] = await getTipoIngredientesService();
    if (error) {

      return handleErrorClient(res, 404, "Error obteniendo tipos de ingredientes", error);
    }
    handleSuccess(res, 200, "Tipos de ingredientes obtenidos", tipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener un tipo de ingrediente
export async function getTipoIngrediente(req, res) {
  try {
    const { id_tipo_ingrediente } = req.params;
    const { error } = tipoIngredienteQueryValidation.validate({ id_tipo_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [tipoIngrediente, errorTipoIngrediente] = await getTipoIngredienteByIdService(id_tipo_ingrediente);
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 404, "Error obteniendo tipo de ingrediente", errorTipoIngrediente);
    }
    handleSuccess(res, 200, "Tipo de ingrediente encontrado", tipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para actualizar un tipo de ingrediente
export async function updateTipoIngrediente(req, res) {
  try {
   const { nombre_tipo_ingrediente } = req.body;
    const { error } = tipoIngredienteBodyValidation.validate({ nombre_tipo_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const { id_tipo_ingrediente } = req.params;
    const [updatedTipoIngrediente, errorTipoIngrediente] = await updateTipoIngredienteService
    (id_tipo_ingrediente, { nombre_tipo_ingrediente });
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 400, "Error actualizando tipo de ingrediente", errorTipoIngrediente);
    }

    handleSuccess(res, 200, "Tipo de ingrediente actualizado exitosamente", updatedTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un tipo de ingrediente
export async function deleteTipoIngrediente(req, res) {
  try {
    const { id_tipo_ingrediente } = req.params;
    const [deletedTipoIngrediente, errorTipoIngrediente] = await deleteTipoIngredienteService(id_tipo_ingrediente);
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 404, "Error eliminando tipo de ingrediente", errorTipoIngrediente);
    }

    handleSuccess(res, 200, "Tipo de ingrediente eliminado exitosamente", deletedTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para crear un ingrediente
export async function createIngrediente(req, res) {
  try {
    const { fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente  } = req.body;
    const { error } = ingredienteBodyValidation.validate(fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [newIngrediente, errorIngrediente] = await createIngredienteService(

    );
    if (errorIngrediente) {
      return handleErrorClient(res, 400, "Error creando ingrediente", errorIngrediente);
    }
    handleSuccess(res, 201, "Ingrediente creado exitosamente", newIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los ingredientes
export async function getIngredientes(req, res) {
  try {
    const [ingredientes, error] = await getIngredientesService();
    if (error) {
      return handleErrorClient(res, 404, "Error obteniendo ingredientes", error);
    }

    handleSuccess(res, 200, "Ingredientes obtenidos", ingredientes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener un ingrediente
export async function getIngrediente(req, res) {
  try {
    const { id_ingrediente } = req.params;
    const { error } = ingredienteQueryValidation.validate({ id_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [ingrediente, errorIngrediente] = await getIngredienteByIdService(id_ingrediente);
    if (errorIngrediente) {
      return handleErrorClient(res, 404, "Error obteniendo ingrediente", errorIngrediente);
    }

    handleSuccess(res, 200, "Ingrediente encontrado", ingrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para actualizar un ingrediente
export async function updateIngrediente(req, res) {
  try {
    
   const { fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente  } = req.body;
    const { error } = ingredienteBodyValidation.validate(fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [newIngrediente, errorIngrediente] =  await updateIngredienteService
    (id_ingrediente, { fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente });	
    if (errorIngrediente) {
      return handleErrorClient(res, 400, "Error actualizando ingrediente", errorIngrediente);
    }
    handleSuccess(res, 200, "Ingrediente actualizado exitosamente", newIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un ingrediente
export async function deleteIngrediente(req, res) {
  try {
const { id_ingrediente } = req.params;
    const [deletedIngrediente, errorIngrediente] = await deleteIngredienteService(id_ingrediente);
    if (errorIngrediente) {
      return handleErrorClient(res, 404, "Error eliminando ingrediente", errorIngrediente);
    }

    handleSuccess(res, 200, "Ingrediente eliminado exitosamente", deletedIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
