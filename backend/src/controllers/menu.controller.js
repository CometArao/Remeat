"use strict";
import{
    activarMenuService,
    createMenuService,
    deleteMenuByIdService,
    generateMenuQRCode,
    getMenuByIdService,
    getMenusService,
    updateMenuService

}
from "../services/menu.service.js";

import{
    menuBodyValidation,
    menuQueryValidation,
}
from "../validations/menu.validation.js";

import{
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}
from "../handlers/responseHandlers.js";



export async function getMenuQRCodeController(req, res) {
    try {
        // Obtener los menús desde el servicio
        const [menus, errorMenus] = await getMenusService();

        if (errorMenus || menus.length === 0) {
            return handleErrorServer(res, 404, "No se encontró el menú del día");
        }

        // Ordenar los menús por fecha descendente
        const menusOrdenados = menus.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Seleccionar el primer menú como el menú del día
        const menuDelDia = menusOrdenados[0];

        if (!menuDelDia) {
            return handleErrorServer(res, 404, "No se encontró el menú del día");
        }

        // Validar que el menú contiene los datos necesarios
        if (
            !menuDelDia.platillos ||
            !Array.isArray(menuDelDia.platillos) ||
            menuDelDia.platillos.length === 0
        ) {
            return handleErrorServer(res, 400, "El menú del día no contiene platillos válidos");
        }

        try {
            // Codificar los datos del menú para incluirlos en la URL
            const menuDataEncoded = Buffer.from(JSON.stringify(menuDelDia)).toString('base64');
             console.log(menuDataEncoded);
            // Generar la URL pública
            const qrCodeUrl = `http://localhost:5173/menu-dia?menuData=${menuDataEncoded}`;

            // Generar el código QR con la URL pública
            const qrCode = await generateMenuQRCode(qrCodeUrl);

            // Enviar el código QR como respuesta
            handleSuccess(res, 200, "QR de los platillos del menú generado exitosamente", { qrCode });
        } catch (error) {
            console.error("Error al generar el QR:", error.message);
            return handleErrorServer(res, 500, error.message);
        }
    } catch (error) {
        console.error("Error en getMenuQRCodeController:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}







export async function createMenuController(req, res) {
    try {
        console.log ("CONTROLADOR:",req.body);
       const { fecha, disponibilidad, id_usuario, platillos } = req.body;

       const { error } = menuBodyValidation.validate({ fecha,  disponibilidad, id_usuario, platillos });

       if(error) return handleErrorClient(res, 400, error.message);

       const [newMenu, errorMenu] = await 
        createMenuService({ fecha, disponibilidad, id_usuario, platillos });

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 201, "Menú creado exitosamente", newMenu);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function getMenusController(req, res){
    try{
        const [menus, errorMenus] = await getMenusService();

        if(errorMenus) return handleErrorClient(res, 404, errorMenus);

        menus.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Menús encontrados", menus);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMenuByIdController(req, res){
    try{
        const { id_menu } = req.params;

        const { error } = menuQueryValidation.validate({ id_menu });

        if(error) return handleErrorClient(res, 400, error.message);

        const [menu, errorMenu] = await getMenuByIdService(id_menu);

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú encontrado", menu);

    }
    catch(error){
        
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteMenuController(req, res){
    try{
        const { id } = req.params;

        const { error } = menuQueryValidation.validate({ id });

        if(error) return handleErrorClient(res, 400, error.message);

        const [menu, errorMenu] = await deleteMenuByIdService(id);

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú eliminado", menu);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateMenuController(req, res){
    try{
        const { id_menu } = req.params;

        const { fecha, disponibilidad, id_usuario, platillos } = req.body;

        const { error } = menuBodyValidation.validate({ fecha, disponibilidad, id_usuario, platillos });

        if(error) return handleErrorClient(res, 400, error.message);

     
        const [menu, errorMenu] = await updateMenuService(id_menu, { fecha, disponibilidad, id_usuario, platillos } );

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú actualizado", menu);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}
export async function activarMenuController(req, res) {
    try {
        const { id } = req.params;

        // Validar que el ID del menú es válido
        if (!id) {
            return handleErrorClient(res, 400, "El ID del menú es requerido.");
        }

        // Llamar al servicio para activar el menú
        const [menuActivo, error] = await activarMenuService(id);

        // Manejar errores desde el servicio
        if (error) {
            return handleErrorClient(res, 404, error);
        }

        // Respuesta exitosa
        handleSuccess(res, 200, "Menú activado exitosamente", menuActivo);
    } catch (error) {
        console.error("Error en activarMenuController:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}