"use strict";
import { AppDataSource } from "../config/configDb.js";
import Menu from "../entity/menu.entity.js";
import Platillo from "../entity/platillo.entity.js";
import Usuario from "../entity/usuario.entity.js";

import QRCode from "qrcode";



/**
 * 
 * @param {Object} menuData 
 * @returns {Promise<string>} 
 */
export async function generateMenuQRCode(menuData) {
    // Extraemos solo la información de los platillos
    const platillosData = menuData.platillo.map(platillo => ({
      nombre_platillo: platillo.nombre_platillo,
      precio_platillo: platillo.precio_platillo,
      disponible: platillo.disponible
    }));
  
    const dataString = JSON.stringify({ platillos: platillosData });
  
    try {
      // Generamos el código QR
      const qrCode = await QRCode.toDataURL(dataString);
      return qrCode; // Devolvemos el código QR en formato Base64
    } catch (error) {
      console.error("Error generando el QR del menú:", error);
      throw new Error("Error al generar el código QR del menú");
    }
  }







export async function createMenuService(data) {
    const menuRepository = AppDataSource.getRepository(Menu);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    try {
        const { fecha, disponibilidad, id_usuario, platillos } = data;

        // Verificar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOneBy({ id_usuario });
        if (!usuarioExistente) {
            return [null, `El usuario con ID ${id_usuario} no existe.`];
        }
        // Verificar que todos los platillos existen
        const platillosValidos = await platilloRepository.findByIds(platillos.map(p => p.id_platillo));
        if (platillosValidos.length !== platillos.length) {
            return [null, "Uno o más platillos no existen."];
        }

        // Crear el menú
        const newMenu = menuRepository.create({
            fecha,
            disponibilidad,
            usuario: usuarioExistente, // Relacionar con el usuario
            platillo: platillosValidos // Relacionar con los platillos validados
        });
        await menuRepository.save(newMenu);
        return [newMenu, null];
    } catch (error) {
        console.error("Error al crear el menú:", error);
        return [null, error.message];
    }
}




export async function getMenusService() {
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


export async function getMenuByIdService(id_menu) {
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


export async function updateMenuService() {
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

export async function deleteMenuByIdService(id_menu) {
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


