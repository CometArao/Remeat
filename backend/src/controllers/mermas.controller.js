"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getUtensiliosDeTipoService } from "../services/graph.service.js"
import { tipo_utensilioValidation, tipo_utensilioQueryValidation, utensilioValidation, utensilioQueryValidation } from "../validations/utensilio.validation.js"

export async function createMerma(req, res) {
    try {
        const {body} = req 
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

export async function getMerma(req, res) {
    console.log("stock utensilio")
    try {
        const id_tipo_utensilio = req.params.id;
        const {error} = tipo_utensilioQueryValidation.validate({id_tipo_utensilio: id_tipo_utensilio}) 

        if(error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }
        const [utensilios, errorTipoUtensilio] = 
                await getUtensiliosDeTipoService(id_tipo_utensilio);
        console.log("utensilios")
        console.log(utensilios)
        let cantidad_total_ingrediente = 0;
        for(let i = 0; i < utensilios.length; i++) {
            cantidad_total_ingrediente += utensilios[i]['cantidad_utensilio'];
        }
        //Una vez tenga la cantidad de la fecha actual
        //buscar x fechas anteriores y ver como cambia
        let datos_retorno = []
        let entrada1 = {fecha: new Date(), cantidad: cantidad_total_ingrediente}
        const X = 10; //Cantidad de fechas que se mostraran en el grafico //TODO: mostrar de alguna forma que permita configurarlo
        for(let i = 0; i < X; i++) {
            //get todos los pedidos y mermas
            
        }


        if(errorTipoUtensilio) {
            return handleErrorClient(res, 400, "Error en la consulta", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "Tipo utensilio creado correctamente", cantidad_total_ingrediente)
        return;
    }catch(error) {
        handleErrorServer(res, 500, error.message);
    }
}