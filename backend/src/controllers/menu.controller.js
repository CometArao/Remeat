"use strict";
import{
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
      const qrCode = await generateMenuQRCode();
      // eslint-disable-next-line quotes
      handleSuccess(res, 200, 'QR del menú generado exitosamente', { qrCode });
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }

export async function createMenuController(req, res) {
    try {
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
        const { id_menu } = req.params;

        const { error } = menuQueryValidation.validate({ id_menu });

        if(error) return handleErrorClient(res, 400, error.message);

        const [menu, errorMenu] = await deleteMenuByIdService(id_menu);

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú eliminado", menu);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateMenuController(req, res){
    try{
        const { fecha, disponibilidad, id_usuario,platillos } = req.body;

        const { error } = menuBodyValidation.validate({ fecha, disponibilidad, id_usuario, platillos });

        if(error) return handleErrorClient(res, 400, error.message);

     
        const [menu, errorMenu] = await updateMenuService({ id_menu, fecha, disponibilidad, id_usuario, platillos });

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú actualizado", menu);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}
