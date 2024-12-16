"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getIngredientesDeTipoService, getIngresosVentasService, getMenuPlatilloService, 
    getUtensiliosDeTipoService, getVentasPlatilloService } from "../services/informes.service.js"
import { getCostosService } from "../services/costo2.service.js";
import { tipo_utensilioQueryValidation, tipo_utensilioValidation, 
    utensilioQueryValidation, utensilioValidation } from "../validations/utensilio.validation.js"

export async function getStockIngrediente(req, res) {
    const { body } = req;
    try {
        const [datos_ingrediente, errorIngrediente] = 
            await getIngredientesDeTipoService(body);
        if(errorIngrediente) {
            console.log(errorIngrediente)
            return handleErrorClient(res, 400, errorIngrediente)
        }
        console.log(datos_ingrediente)
        return handleSuccess(res, 200, "Consulta stock inventarios resuelta con exito", datos_ingrediente);

    }catch(error) {
        console.log(error)
        return handleErrorServer(res, 500, error.message);
    }
}


export async function getStockUtensilio(req, res) {
    const { body } = req
    //const { error } = 
    console.log(body)
    try {
        //const id_tipo_utensilio = req.params.id;
        //const { error } = tipo_utensilioQueryValidation.validate({ id_tipo_utensilio: id_tipo_utensilio })
        //if (error) {
            //return handleErrorClient(res, 400, "Error de validación", error.message);
        //}
        const [datos_utensilios, errorTipoUtensilio] =
            await getUtensiliosDeTipoService(body);
        return handleSuccess(res, 201, "Datos stock utensilio consultados exitosamente", datos_utensilios)
    } catch (error) {
        console.log(error)
        return handleErrorServer(res, 500, error.message);
    }
}

export async function getIngresosPorVentas(req, res) {
    try {
        const { body } = req;
        const [ingresos_ventas, error] = await getIngresosVentasService(body);
        if (error) return handleErrorClient(res, 404, error);

        console.log(ingresos_ventas)
        handleSuccess(res, 200, "Ingresos obtenidos exitosamente", ingresos_ventas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
        console.log(error)
    }
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
export async function getPlatillosMenu(req, res) {
    //consigue una lista de platillos y su relacion con el menu
    try {
        const { body } = req;

        const [menu_platillos, error] = await getMenuPlatilloService(body);
        if (error) {
            console.log(error)
            return handleErrorClient(res, 404, error);
        } 
        return handleSuccess(res, 200, "menu platillo obtenido exitosamente", menu_platillos);
    } catch (error) {
        console.log(error)
        return handleErrorServer(res, 500, error.message);
    }
}
export async function getCostos(req, res) {
    try {
        const { body } = req;
        const [costos, error] = await getCostosService(body);
        if (error) {
            console.log(error)
            return handleErrorClient(res, 404, error);
        } 
        return handleSuccess(res, 200, "costos platillo obtenido exitosamente", costos);
    } catch (error) {
        console.log(error)
        return handleErrorServer(res, 500, error.message);
    }
}