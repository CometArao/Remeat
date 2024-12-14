"use strtict"
import {
    assignPriceToPlatilloService,
    confirmarPlatilloService,
    createPlatilloService,
    deletePlatilloByIdService,  
    getPlatilloByIdService,
    getPlatillosService,
    updatePlatilloByIdService
} from "../services/platillo.service.js";
import {
    platilloBodyValidation,
    platilloPrecioValidation
} from "../validations/platillo.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createPlatilloController(req, res) {
    try {
        const { nombre_platillo, disponible, ingredientes } = req.body;
        console.log("Usuario desde req.user:", req.user);
        //Obtener el id del usuario desde el token
        const id_usuario = req.user.id_usuario;
            console.log("Usuario desde req.user2:", req.user);

        // Validar los datos del platillo
        const { error } = platilloBodyValidation.validate({ nombre_platillo });

        if (error) return handleErrorClient(res, 400, error.message);

        const [newPlatillo, errorPlatillo] = await createPlatilloService({
            nombre_platillo,
            disponible,
            ingredientes
        }, id_usuario);

        if (errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 201, "Platillo creado", newPlatillo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function assignPriceToPlatilloController(req, res) {
    try {
        const { id_platillo } = req.params;
        const { precio_platillo } = req.body;
        const { error } = platilloPrecioValidation.validate({ precio_platillo });

        // Verificar si el usuario es administrador
        if (req.user.rol_usuario !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permiso para asignar precio a un platillo.");
        }

        // Validar el precio del platillo para asegurar que no es negativo
        if (error) {
            return handleErrorClient(res, 400, error.message);
        }

        const [updatedPlatillo, serviceError] = await assignPriceToPlatilloService({ id_platillo, precio_platillo });

        if (serviceError) return handleErrorClient(res, 404, serviceError);

        handleSuccess(res, 200, "Precio asignado al platillo exitosamente", updatedPlatillo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function getPlatillosController(req, res){
    try{
        const [platillos, errorPlatillos] = await getPlatillosService();

        if(errorPlatillos) return handleErrorClient(res, 404, errorPlatillos);

        platillos.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Platillos encontrados", platillos);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function getPlatilloByIdController(req, res){
    try{
        const { id_platillo } = req.params;

        const [platillo, errorPlatillo] = await getPlatilloByIdService(id_platillo);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo encontrado", platillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function updatePlatilloController(req, res){
    try{
        const { id_platillo } = req.params;

        const { error } = platilloBodyValidation.validate(req.body);

        if(error) return handleErrorClient(res, 400, error.message);

        const [updatedPlatillo, errorPlatillo] = await updatePlatilloByIdService(id_platillo, req.body);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo actualizado", updatedPlatillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function deletePlatilloController(req, res){
    try{
        const { id_platillo } = req.params;

        const [platillo, errorPlatillo] = await deletePlatilloByIdService(id_platillo);

        if(errorPlatillo) return handleErrorClient(res, 404, errorPlatillo);

        handleSuccess(res, 200, "Platillo eliminado", platillo);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function confirmarPlatilloController(req, res) {
    try {
      const {  nuevo_estado } = req.body;
        const { id_platillo, id_comanda } = req.params;
  
      // Validar parámetros obligatorios
      if (!nuevo_estado) {
        return handleErrorClient(res, 400, "Se requiere el campo nuevo_estado.");
      }
  
      // Llamar al servicio para confirmar el platillo
      const [resultado, resultadoError] = await confirmarPlatilloService( id_platillo, id_comanda, nuevo_estado)
      if (resultadoError) {
        return handleErrorClient(res, 404, resultadoError);
      }
   
  
      handleSuccess(res, 200, "Estado del platillo actualizado con éxito.", resultado);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
