"use strict";
import Menu from "../entity/menu.entity.js";


export async function createMenu(menuData) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);
        const { fecha, disponibilidad, id_usuario, platilloIds } = menuData;


        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message,
        });

        // Validar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOne(id_usuario);
        if (!usuarioExistente) {
            return [null, createErrorMessage("id_usuario", `El usuario con ID ${id_usuario} no existe.`)];
        }

        const newMenu = menuRepository.create({
            fecha,
            disponibilidad,
            usuario: usuarioExistente,
            platillo: platilloIds ? platilloIds.map((id) => ({ id_platillo: id })) : [],

        });

        await menuRepository.save(newMenu);

        return [newMenu, null];

    } catch (error) {
        console.error("Error al crear el menú", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getMenus() {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);

        const menus = await menuRepository.find({
            relations: ["platillo", "usuario"],
        });

        return [menus, null];
    } catch (error) {
        console.error("Error al obtener los menús", error);
        return [null, "Error interno del servidor"];
    }
}


export async function getMenuById(id_menu) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);

        const menuItem = await menuRepository.findOne({
            where: { id_menu },
            relations: ["platillo", "usuario"],
        });

        if (!menuItem) {
            return [null, { dataInfo: "id_menu", message: `El menú con ID ${id_menu} no existe.` }];
        }

        return [menuItem, null];
    } catch (error) {
        console.error("Error al obtener el menú", error);
        return [null, "Error interno del servidor"];
    }
}


export async function updateMenu() {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);
        const { id_menu, fecha, disponibilidad, id_usuario, platilloIds } = query;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message,
        });

        const menuFound = await menuRepository.findOne({
            where: { id: id_menu },
            relations: ["platillo", "usuario"],
        });

        if (!menuFound) return [null, createErrorMessage("id_menu", `El menú con ID ${id_menu} no existe.`)];


        menuFound.fecha = fecha;
        menuFound.disponibilidad = disponibilidad;

        // Si se proporciona un nuevo id_usuario, validamos y actualizamos
        if (id_usuario) {
            const usuarioExistente = await usuarioRepository.findOne(id_usuario);
            if (!usuarioExistente) {
                return [
                    null,
                    createErrorMessage("id_usuario", "El usuario no existe."),
                ];
            }
            menuFound.usuario = usuarioExistente;

        }

        // Actualizar las relaciones many-to-many con platillo
        if (platilloIds) {
            menuToUpdate.platillo = platilloIds.map((id) => ({
                id_platillo: id,
            }));
        }

        await menuRepository.save(menuFound);
        return [menuFound, null];

    } catch (error) {
        console.error("Error al actualizar el menú", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteMenuById(id_menu) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);

        const menuFound = await menuRepository.findOne({
            where: { id: id_menu },
            relations: ["platillo", "usuario"],
        });

        if (!menuFound) return [null, { dataInfo: "id_menu", message: `El menú con ID ${id_menu} no existe.` }];

        const menuDeleted = await menuRepository.remove(menuFound);

        return [menuDeleted, null];

    } catch (error) {
        console.error("Error al eliminar un menu:", error);
        return [null, "Error interno del servidor"];

    }
}


