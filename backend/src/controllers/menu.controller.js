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
import e from "cors";



export async function getMenuQRCodeController(req, res) {
    try {
        // Llamar al servicio para generar el QR del menú
        const qrCode = await generateMenuQRCode();

        // Responder con el código QR
        handleSuccess(res, 200, "QR del menú generado exitosamente", { qrCode });
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}






export async function createMenuController(req, res) {
    try {

        const { fecha, disponibilidad, platillos } = req.body;

        // Obtener el ID del usuario logueado desde req.user
        const id_usuario = req.user.id_usuario;

        // Validar los datos del cuerpo (sin id_usuario porque se obtiene automáticamente)
        const { error } = menuBodyValidation.validate({ fecha, disponibilidad, platillos });

        if (error) return handleErrorClient(res, 400, error.message);

        // Llamar al servicio pasando el id_usuario desde req.user
        const [newMenu, errorMenu] = await createMenuService(
            { fecha, disponibilidad, platillos },
            id_usuario // Se pasa como argumento
        );

        if (errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 201, "Menú creado exitosamente", newMenu);
    } catch (error) {
        console.error("Error en createMenuController:", error.message);
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

        if(errorMenu) return handleErrorClient(res, 404, errorMenu,
            { status: "Client error", message: errorMenu });

        handleSuccess(res, 200, "Menú eliminado", menu);
    }
    catch(error){
        console.error("Error al eliminar un menú:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateMenuController(req, res){
    try{
        const { id } = req.params;

        const { fecha, disponibilidad, id_usuario, platillos } = req.body;

        const { error } = menuBodyValidation.validate({ fecha, disponibilidad, id_usuario, platillos });

        if(error) return handleErrorClient(res, 400, error.message);

     
        const [menu, errorMenu] = await updateMenuService(id, { fecha, disponibilidad, id_usuario, platillos } );

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

        // Llamar al servicio para alternar la disponibilidad
        const [updatedMenu, error] = await activarMenuService(id);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        const message = updatedMenu.disponibilidad
            ? "Menú activado correctamente."
            : "Menú desactivado correctamente.";

        handleSuccess(res, 200, message, updatedMenu);
    } catch (error) {
        console.error("Error en activarMenuController:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}
