"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { createTipoUtensilioService, getTipoUtensilioService, getTiposUtensilioService, updateTipoUtensilioService, deleteTiposUtensiliosService} from "../services/tipo_utensilio.service.js"
import { createUtensilioService, getUtensilioService, getUtensiliosService, updateUtensilioService, deleteUtensilioService } from "../services/utensilio.service.js";
import { tipo_utensilioValidation, tipo_utensilioQueryValidation, utensilioValidation, utensilioQueryValidation } from "../validations/utensilio.validation.js"

//Tipo Utensilios
export async function createTipoUtensilio(req, res) {
    try {
        const {body} = req 
        console.log(body)
        const {error} = tipo_utensilioValidation.validate(body) 

        if(error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }
        const [nuevoTipoUtensilio, errorTipoUtensilio] = await createTipoUtensilioService(body);

        if(errorTipoUtensilio) {
            return handleErrorClient(res, 400, "Error creando Utensilio", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "Tipo utensilio creado correctamente", nuevoTipoUtensilio)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getTipoUtensilio(req, res) {
    try {
        //get id
        const id_tipo_utensilio = req.params.id;
        //validar consulta
        const { error: queryError } = tipo_utensilioQueryValidation.validate({
        id_tipo_utensilio,
        });
        if (queryError) {
        return handleErrorClient(
            res,
            400,
            "Error de validación en la consulta",
            queryError.message,
        );
        }
        //invocar servicio para extraer de la base de datos
        const TipoUtensilioEncontrado = await getTipoUtensilioService({
            id_tipo_utensilio: id_tipo_utensilio,
        });
        //verificar si se encontro el tipo_utensilio
        if(!TipoUtensilioEncontrado) {
            return res.status(404).json({
                message: "Tipo Utensilio no encontrado",
                data: null
            })
        }
        handleSuccess(res, 201, "Tipo Utensilio Encontrado", TipoUtensilioEncontrado)
        console.log(TipoUtensilioEncontrado)
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getTiposUtensilio(req, res) {
  try {
    const [tipo_utensilios, errorUsers] = await getTiposUtensilioService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);
    console.log("en controller")
    console.log(tipo_utensilios)
    handleSuccess(res, 200, "Tipos utensilios encontrados", tipo_utensilios);

  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}
export async function updateTipoUtensilio(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = tipo_utensilioValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );
    const [tipo_utensilio, error_tipo_utensilio] = await updateTipoUtensilioService(body);

    if (error_tipo_utensilio) return handleErrorClient(res, 400, "Error modificando al tipo_utensilio", error_tipo_utensilio);

    handleSuccess(res, 200, "Usuario modificado correctamente", tipo_utensilio);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
export async function deleteTipoUtensilio(req, res) {
  try {
    const id_tipo_utensilio = req.params.id;
    const { error: queryError } = tipo_utensilioQueryValidation.validate({
      id_tipo_utensilio,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }
    const [tipo_utensilio, error_tipo_utensilio] = await deleteTiposUtensiliosService({
        id_tipo_utensilio: id_tipo_utensilio
    });

    if (error_tipo_utensilio) return handleErrorClient(res, 400, "Error eliminando al tipo_utensilio", error_tipo_utensilio);

    handleSuccess(res, 200, "Usuario eliminado correctamente", tipo_utensilio);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
    return
}
//Utensilios
export async function createUtensilio(req, res) {
    try {
        const {body} = req 
        const {error} = utensilioValidation.validate(body) 

        if(error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }
        const [nuevoTipoUtensilio, errorTipoUtensilio] = await createUtensilioService(body);

        if(errorTipoUtensilio) {
            return handleErrorClient(res, 400, "Error creando Utensilio", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "Utensilio creado correctamente", nuevoTipoUtensilio)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getUtensilio(req, res) {
    try {
        const id_utensilio = req.params.id;
        const { error: queryError } = utensilioQueryValidation.validate({
        id_utensilio,
        });

        if (queryError) {
        return handleErrorClient(
            res,
            400,
            "Error de validación en la consulta",
            queryError.message,
        );
        }
        const utensilioEncontrado = await getUtensilioService({
            id_utensilio: id_utensilio,
        });
        if(!utensilioEncontrado) {
            return res.status(404).json({
                message: "Utensilio no encontrado",
                data: null
            })
        }
        handleSuccess(res, 201, "Utensilio Encontrado", utensilioEncontrado)
        console.log(utensilioEncontrado)
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getUtensilios(req, res) {
  console.log("get utensilios")
    try {
        const id_utensilio = req.params.id;
        const utensilioEncontrado = await getUtensiliosService();
        if(!utensilioEncontrado) {
            return res.status(404).json({
                message: "Utensilio no encontrado",
                data: null
            })
        }
        handleSuccess(res, 201, "Utensilio Encontrado", utensilioEncontrado)
        console.log(utensilioEncontrado)
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function updateUtensilio(req, res) {
    try {
      //buscar antes
      //validar datos
        const id_utensilio = req.params.id;
        const { error: queryError } = utensilioQueryValidation.validate({
        id_utensilio,
        });

        if (queryError) {
        return handleErrorClient(
            res,
            400,
            "Error de validación en la consulta",
            queryError.message,
        );
        }

        const {body} = req 
        const {error} = utensilioValidation.validate(body) 

        if(error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        const [utensilioEncontrados, errorUtensilio] = await updateUtensilioService({ id_utensilio }, body);
        if(errorUtensilio) {
            return handleErrorClient(res, 400, "Error creando Utensilio", errorTipoUtensilio);
        }
        if(!utensilioEncontrados) {
            return res.status(404).json({
                message: "Utensilio no encontrado",
                data: null
            })
        }
      //buscar despues

        handleSuccess(res, 201, "Utensilio Encontrado", utensilioEncontrados)
        console.log(utensilioEncontrados)
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }

}

export async function deleteUtensilio(req, res) {
  try {
    const id_utensilio = req.params.id;

    const { error: queryError } = utensilioQueryValidation.validate({
      id_utensilio,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUtensilioService({
        id_utensilio: id_utensilio
    });

    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
//TODO: falta la validacion de que sea un administrador para editar
//y un cocinero para consultar