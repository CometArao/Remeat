"use strict";
import { 
    createIngredienteService, 
    createTipoIngredienteService,
    deleteIngredienteService, 
    deleteTipoIngredienteService,
    getIngredienteByIdService,
    getIngredientesService,
    getTipoIngredienteByIdService,
    getTipoIngredientesService,
    updateIngredienteService,
    updateTipoIngredienteService 
       } from "../services/ingrediente.service.js";

import { 
      ingredienteBodyValidation,
      ingredienteQueryValidation,
      tipoIngredienteBodyValidation,
      tipoIngredienteQueryValidation 
        } from "../validations/ingrediente.validation.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Controlador para crear un tipo de ingrediente
export async function createTipoIngredienteController(req, res) {
  try {
    const { nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente, id_unidad_medida } = req.body;
    const { error } = tipoIngredienteBodyValidation.validate({ nombre_tipo_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [newTipoIngrediente, errorTipoIngrediente] = await createTipoIngredienteService
    ({ nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente, id_unidad_medida });

    if (errorTipoIngrediente) {
      return handleErrorClient(res, 404, "Error creando tipo de ingrediente", errorTipoIngrediente);
    }
    handleSuccess(res, 201, "Tipo de ingrediente creado exitosamente", newTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los tipos de ingredientes
export async function getTipoIngredientesController(req, res) {
  try {
    const [tipos, error] = await getTipoIngredientesService();
    if (error) {
      return handleErrorClient(
        res,
        404,
        "Error obteniendo tipos de ingredientes",
        error
      );
    }
    handleSuccess(res, 200, "Tipos de ingredientes obtenidos", tipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener un tipo de ingrediente
export async function getTipoIngredienteController(req, res) {
  try {
    const { id } = req.params;
    const { error } = tipoIngredienteQueryValidation.validate({ id_tipo_ingrediente: id } );
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [tipoIngrediente, errorTipoIngrediente] = await getTipoIngredienteByIdService(id);
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 404, "Error obteniendo tipo de ingrediente", errorTipoIngrediente);
    }
    handleSuccess(res, 200, "Tipo de ingrediente encontrado", tipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para actualizar un tipo de ingrediente
export async function updateTipoIngredienteController(req, res) {
  try {
    const { id_tipo_ingrediente } = req.params;
   const { nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente, id_unidad_medida } = req.body;
    const { error } = tipoIngredienteBodyValidation.validate({ nombre_tipo_ingrediente });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    
    const [updatedTipoIngrediente, errorTipoIngrediente] = await updateTipoIngredienteService
    (id_tipo_ingrediente, { nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente, id_unidad_medida });
    if (errorTipoIngrediente) {
      return handleErrorClient(res, 404, "Error actualizando tipo de ingrediente", errorTipoIngrediente);
    }

    handleSuccess(res, 200, "Tipo de ingrediente actualizado exitosamente", updatedTipoIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un tipo de ingrediente
export async function deleteTipoIngredienteController(req, res) {
  try {
    const { id_tipo_ingrediente } = req.params;

    if (!id_tipo_ingrediente) {
      return handleErrorClient(
        res,
        400,
        "ID del tipo de ingrediente no proporcionado."
      );
    }

    const [deletedTipoIngrediente, errorTipoIngrediente] =
      await deleteTipoIngredienteService(id_tipo_ingrediente);

    if (errorTipoIngrediente) {
      return handleErrorClient(
        res,
        404,
        "Error eliminando tipo de ingrediente",
        errorTipoIngrediente
      );
    }

    handleSuccess(
      res,
      200,
      "Tipo de ingrediente eliminado exitosamente",
      deletedTipoIngrediente
    );
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para crear un ingrediente
export async function createIngredienteController(req, res) {
  try {
    const { error } = ingredienteBodyValidation.validate(req.body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const {
      fecha_vencimiento,
      cantidad_ingrediente,
      cantidad_original_ingrediente,
      costo_ingrediente,
      id_tipo_ingrediente,
      id_pedido = null, // Si no se proporciona, será null
    } = req.body;

    const [newIngrediente, errorIngrediente] = await createIngredienteService({
      fecha_vencimiento,
      cantidad_ingrediente,
      cantidad_original_ingrediente,
      costo_ingrediente,
      id_tipo_ingrediente,
      id_pedido,
    });

    if (errorIngrediente) {
      return handleErrorClient(
        res,
        404,
        "Error creando ingrediente",
        errorIngrediente
      );
    }

    // Construir la respuesta con la información del ingrediente, tipo, y pedido
    const responseData = {
      id_ingrediente: newIngrediente.id_ingrediente,
      fecha_vencimiento: newIngrediente.fecha_vencimiento,
      cantidad_ingrediente: newIngrediente.cantidad_ingrediente,
      cantidad_original_ingrediente:
        newIngrediente.cantidad_original_ingrediente,
      costo_ingrediente: newIngrediente.costo_ingrediente,
      id_tipo_ingrediente: newIngrediente.tipo_ingrediente.id_tipo_ingrediente,
      id_pedido: id_pedido || null, // Retornar el id del pedido si se proporcionó
      tipo_ingrediente: {
        id_tipo_ingrediente:
          newIngrediente.tipo_ingrediente.id_tipo_ingrediente,
        nombre_tipo_ingrediente:
          newIngrediente.tipo_ingrediente.nombre_tipo_ingrediente,
        unidad_medida: {
          nombre_unidad_medida:
            newIngrediente.tipo_ingrediente.unidad_medida.nombre_unidad_medida,
        },
      },
      pedido: id_pedido // Verifica si se proporcionó un id_pedido.
        ? { // Si existe un id_pedido, crea el objeto relacionado al pedido.
            id_pedido: id_pedido, // Incluye el id del pedido en la respuesta.
            descripcion_pedido: 
            newIngrediente.compuesto_ingrediente?.[0]?.pedido?.descripcion_pedido 
            || "Sin descripción", // Obtiene la descripción del pedido desde la relación. 
            // Si no existe, usa "Sin descripción".
            fecha_compra_pedido: newIngrediente.compuesto_ingrediente?.[0]?.pedido?.fecha_compra_pedido 
            || "No definida", // Obtiene la fecha de compra del pedido. Si no existe, usa "No definida".
          }
        : null, // Si no se proporcionó un id_pedido, el valor será null.
    };

    handleSuccess(res, 201, "Ingrediente creado exitosamente", responseData);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener todos los ingredientes
export async function getIngredientesController(req, res) {
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
export async function getIngredienteController(req, res) {
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
export async function updateIngredienteController(req, res) {
  try {
    
    const { id_ingrediente } = req.params;
   const { fecha_vencimiento, cantidad_ingrediente,cantidad_original_ingrediente,
    costo_ingrediente, id_tipo_ingrediente } = req.body;
    
    const { error } = ingredienteBodyValidation.validate({ fecha_vencimiento, cantidad_ingrediente,
      cantidad_original_ingrediente,costo_ingrediente,
       id_tipo_ingrediente })// Manejar id_pedido como opcional });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [newIngrediente, errorIngrediente] =  await updateIngredienteService
    (id_ingrediente, { fecha_vencimiento, cantidad_ingrediente,
       cantidad_original_ingrediente, costo_ingrediente, id_tipo_ingrediente });	
    if (errorIngrediente) {
      return handleErrorClient(res, 404, "Error actualizando ingrediente", errorIngrediente);
    }
    handleSuccess(res, 200, "Ingrediente actualizado exitosamente", newIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para eliminar un ingrediente
export async function deleteIngredienteController(req, res) {
  try {
    const { id } = req.params;
    const [deletedIngrediente, errorIngrediente] = await deleteIngredienteService(id);
    if (errorIngrediente) {
      return handleErrorClient(res, 404, "Error eliminando ingrediente", errorIngrediente);
    }

    handleSuccess(res, 200, "Ingrediente eliminado exitosamente", deletedIngrediente);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
