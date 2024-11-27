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

        // Construir la respuesta sin la contraseña del usuario
        const formattedMenu = {
            id_menu: newMenu.id_menu,
            fecha: newMenu.fecha,
            disponibilidad: newMenu.disponibilidad,
            platillos: platillosValidos.map((platillo) => ({
                id_platillo: platillo.id_platillo,
                nombre_platillo: platillo.nombre_platillo,
                precio_platillo: platillo.precio_platillo,
                disponible: platillo.disponible,
            })),
            usuario: {
                id_usuario: usuarioExistente.id_usuario,
                nombre_usuario: usuarioExistente.nombre_usuario,
                rol_usuario: usuarioExistente.rol_usuario,
            },
        };

        return [formattedMenu, null];
      
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

        // Formatear los menús con los datos requeridos
        const formattedMenus = menus.map((menu) => ({
            id_menu: menu.id_menu,
            fecha: menu.fecha,
            disponibilidad: menu.disponibilidad,
            platillos: menu.platillo.map((platillo) => ({
                id_platillo: platillo.id_platillo,
                nombre_platillo: platillo.nombre_platillo,
                precio_platillo: platillo.precio_platillo,
                disponible: platillo.disponible,
            })),
            usuario: {
                id_usuario: menu.usuario.id_usuario,
                nombre_usuario: menu.usuario.nombre_usuario,
                rol_usuario: menu.usuario.rol_usuario,
            },
        }));

        return [formattedMenus, null];
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

         // Formatear el menú con los datos requeridos
         const formattedMenu = {
            id_menu: menuItem.id_menu,
            fecha: menuItem.fecha,
            disponibilidad: menuItem.disponibilidad,
            platillos: menuItem.platillo.map((platillo) => ({
                id_platillo: platillo.id_platillo,
                nombre_platillo: platillo.nombre_platillo,
                precio_platillo: platillo.precio_platillo,
                disponible: platillo.disponible,
            })),
            usuario: {
                id_usuario: menuItem.usuario.id_usuario,
                nombre_usuario: menuItem.usuario.nombre_usuario,
                rol_usuario: menuItem.usuario.rol_usuario,
            },
        };

        return [formattedMenu, null];
    } catch (error) {
        console.error("Error al obtener el menú", error);
        return [null, "Error interno del servidor"];
    }
}


export async function updateMenuService(id_menu, menuData) {
    const menuRepository = AppDataSource.getRepository(Menu);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const { fecha, disponibilidad, id_usuario, platillos } = menuData;

    try {
        // Buscar el menú existente
        const menuFound = await menuRepository.findOne({
            where: { id_menu },
            relations: ["platillo", "usuario"],
        });

        if (!menuFound) {
            return [null, `El menú con ID ${id_menu} no existe.`];
        }

        // Actualizar los campos básicos del menú
        if (fecha !== undefined) menuFound.fecha = fecha;
        if (disponibilidad !== undefined) menuFound.disponibilidad = disponibilidad;

        // Validar y actualizar el usuario asociado si se proporciona un nuevo id_usuario
        if (id_usuario !== undefined) {
            const usuarioFound = await usuarioRepository.findOneBy({ id_usuario });
            if (!usuarioFound) {
                return [null, `El usuario con ID ${id_usuario} no existe.`];
            }
            menuFound.usuario = usuarioFound;
        }

        // Validar y actualizar los platillos asociados si se proporciona el array `platillos`
        if (platillos && platillos.length > 0) {
            const platilloIds = platillos.map((p) => p.id_platillo);

            const platillosValidos = await platilloRepository.findByIds(platilloIds);

            if (platillosValidos.length !== platilloIds.length) {
                return [null, "Uno o más IDs de platillos proporcionados no existen."];
            }

            // Actualizar la relación many-to-many
            menuFound.platillo = platillosValidos;
        }

        // Guardar el menú actualizado en la base de datos
        const updatedMenu = await menuRepository.save(menuFound);

        // Construir la estructura de respuesta para mayor claridad
        const response = {
            id_menu: updatedMenu.id_menu,
            fecha: updatedMenu.fecha,
            disponibilidad: updatedMenu.disponibilidad,
            usuario: {
                id_usuario: updatedMenu.usuario.id_usuario,
                nombre_usuario: updatedMenu.usuario.nombre_usuario,
                correo_usuario: updatedMenu.usuario.correo_usuario,
            },
            platillos: updatedMenu.platillo.map((platillo) => ({
                id_platillo: platillo.id_platillo,
                nombre_platillo: platillo.nombre_platillo,
                precio_platillo: platillo.precio_platillo,
                disponible: platillo.disponible,
            })),
        };

        return [response, null];
    } catch (error) {
        console.error("Error al actualizar el menú:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function deleteMenuByIdService(id_menu) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);

        const menuFound = await menuRepository.findOne({
            where: {  id_menu },
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


