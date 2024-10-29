"use strict";
import{
    createMenu,
    deleteMenuById,
    getMenuById,
    getMenus,
    updateMenu,
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

export async function createMenuController(req, res){
    console.log("Keys de req.body:", Object.keys(req.body));

    try{
        const { fecha, disponibilidad, id_horario_dia, platilloIds, usuarioIds } = req.body;

        // eslint-disable-next-line max-len
        const { error } = menuBodyValidation.validate({ fecha, disponibilidad, id_horario_dia, platilloIds, usuarioIds });

        if(error) return handleErrorClient(res, 400, error.message);

        // eslint-disable-next-line max-len
        const [newMenu, errorMenu] = await createMenu({ fecha, disponibilidad, id_horario_dia, platilloIds, usuarioIds });

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 201, "Menú creado", newMenu);
    }catch(error){
        handleErrorServer(res, 500, error.message);
    }
}

export async function getMenusController(req, res){
    try{
        const [menus, errorMenus] = await getMenus();

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

        const [menu, errorMenu] = await getMenuById(id_menu);

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

        const [menu, errorMenu] = await deleteMenuById(id_menu);

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
        const { fecha, disponibilidad, id_horario_dia, platilloIds, usuarioIds } = req.body;

        const { error } = menuQueryValidation.validate({ id_menu });

        if(error) return handleErrorClient(res, 400, error.message);

        // eslint-disable-next-line max-len
        const [menu, errorMenu] = await updateMenu({ id_menu, fecha, disponibilidad, id_horario_dia, platilloIds, usuarioIds });

        if(errorMenu) return handleErrorClient(res, 404, errorMenu);

        handleSuccess(res, 200, "Menú actualizado", menu);
    }
    catch(error){
        handleErrorServer(res, 500, error.message);
    }
}