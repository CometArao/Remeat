"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getMenuPlatilloService, getUtensiliosDeTipoService, getVentasPlatilloService } from "../services/graph.service.js"
import { tipo_utensilioValidation, tipo_utensilioQueryValidation, utensilioValidation, utensilioQueryValidation } from "../validations/utensilio.validation.js"

export async function getStockIngrediente(req, res) {
}

export async function getStockUtensilio(req, res) {
    console.log("stock utensilio")
    try {
        const id_tipo_utensilio = req.params.id;
        const { error } = tipo_utensilioQueryValidation.validate({ id_tipo_utensilio: id_tipo_utensilio })

        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }
        const [utensilios, errorTipoUtensilio] =
            await getUtensiliosDeTipoService(id_tipo_utensilio);
        console.log("utensilios")
        console.log(utensilios)
        let cantidad_total_ingrediente = 0;
        for (let i = 0; i < utensilios.length; i++) {
            cantidad_total_ingrediente += utensilios[i]['cantidad_utensilio'];
        }
        //Una vez tenga la cantidad de la fecha actual
        //buscar x fechas anteriores y ver como cambia
        let datos_retorno = []
        let entrada1 = { fecha: new Date(), cantidad: cantidad_total_ingrediente }
        const X = 10; //Cantidad de fechas que se mostraran en el grafico //TODO: mostrar de alguna forma que permita configurarlo
        for (let i = 0; i < X; i++) {

        }


        if (errorTipoUtensilio) {
            return handleErrorClient(res, 400, "Error en la consulta", errorTipoUtensilio);
        }
        handleSuccess(res, 201, "Tipo utensilio creado correctamente", cantidad_total_ingrediente)
        return;
    } catch (error) {
        handleErrorServer(res, 500, error.message);
        console.log(error)
    }
}

export async function IngresosPorVentas(req, res) {
    
}

//circulares y de barras
export async function getVentasPlatillo(req, res) {
    try {
        const [ventas_platillo, error] = await getVentasPlatilloService();
        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Usuario obtenido exitosamente", ventas_platillo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
        console.log(error)
    }


}
export async function getPlatillosMenu() {
    //consigue una lista de platillos y su relacion con el menu
    try {
        const [menu_platillos, error] = await getMenuPlatilloService();
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "menu platillo obtenido exitosamente", menu_platillos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}