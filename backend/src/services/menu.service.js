"use strict";
import { AppDataSource } from "../config/configDb.js";
import Menu from "../entity/menu.entity.js";
import Platillo from "../entity/platillo.entity.js";
import Usuario from "../entity/usuario.entity.js";
import QRCode from "qrcode";


// Función para generar un código QR con los datos de un menú
export async function generateMenuQRCode() {
    const menuRepository = AppDataSource.getRepository(Menu);

    try {
        // Obtener un menú disponible
        const menuDisponible = await menuRepository.findOne({
            where: { disponibilidad: true },
            relations: ["platillo"],
        });
        // Verificar si hay un un menú disponible
        if (!menuDisponible) {
            throw new Error("No se encontró un menú disponible.");
        }

        console.log("Menú seleccionado para QR:", menuDisponible);

        // Codificar los datos del menú en Base64
        const menuDataEncoded = Buffer.from(JSON.stringify(menuDisponible)).toString("base64");

        // Generar la URL con los datos del menú
        const qrCodeUrl = `http://localhost:5173/menu-dia?menuData=${menuDataEncoded}`;

        // Generar el código QR con la URL
        const qrCode = await QRCode.toDataURL(qrCodeUrl);

        return qrCode;
    } catch (error) {
        console.error("Error generando el QR del menú:", error.message);
        throw new Error("Error al generar el código QR del menú: " + error.message);
    }
}




// Función para crear un menú
export async function createMenuService(data, userId) {
    const menuRepository = AppDataSource.getRepository(Menu);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    try {
        const { fecha, disponibilidad, platillos } = data; // Eliminamos id_usuario del destructuring

        // Verificar que el usuario logueado existe
        const usuarioExistente = await usuarioRepository.findOneBy({ id_usuario: userId });
        if (!usuarioExistente) {
            return [null, `El usuario con ID ${userId} no existe.`];
        }

        // Validar los platillos seleccionados
        const platillosValidos = [];
        for (const platilloSeleccionado of platillos) {
            const platillo = await platilloRepository.findOne({
                where: { id_platillo: platilloSeleccionado.id_platillo },
            });

            // Si el platillo no existe o no está disponible
            if (!platillo) {
                return [null, `El platillo no existe.`];
            }
            if (!platillo.disponible) {
                return [null, `El platillo "${platillo.nombre_platillo}" no está disponible.`];
            }


            platillosValidos.push(platillo);
        }

        if (platillosValidos.length === 0) {
            return [null, "No hay platillos válidos para crear el menú."];
        }

        // Si el menú se crea con disponibilidad activa, desactivar otros menús
        if (disponibilidad) {
            await menuRepository.update({ disponibilidad: true }, { disponibilidad: false });
        }

        // Crear el nuevo menú con el usuario logueado
        const newMenu = menuRepository.create({
            fecha,
            usuario: usuarioExistente,
            platillo: platillosValidos,
            disponibilidad: false, // El menú se crea como no disponible por defecto
        });

        await menuRepository.save(newMenu);

        // Formatear la respuesta
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



// Función para obtener todos los menús
export async function getMenusService() {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);
        // Obtener todos los menús con sus relaciones
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

// Función para obtener un menú por su ID
export async function getMenuByIdService(id_menu) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);
        // Obtener el menú con sus relaciones
        const menuItem = await menuRepository.findOne({
            where: { id_menu },
            relations: ["platillo", "usuario"],
        });
        // verificar si el menú existe
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
// Función para actualizar un menú
export async function updateMenuService(id_menu, menuData) {
    const menuRepository = AppDataSource.getRepository(Menu);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const { fecha, id_usuario, platillos } = menuData;

    try {
        // Buscar el menú existente
        const menuFound = await menuRepository.findOne({
            where: { id_menu },
            relations: ["platillo", "usuario"],
        });
        // Verificar si el menú existe
        if (!menuFound) {
            return [null, `El menú con ID ${id_menu} no existe.`];
        }

        console.log("Menú encontrado antes de actualización:", menuFound);

        // Actualizar los campos básicos del menú
        if (fecha !== undefined) {
            menuFound.fecha = fecha;
            console.log("Fecha actualizada:", fecha);
        }

        // Validar y actualizar el usuario asociado si se proporciona un nuevo id_usuario
        if (id_usuario !== undefined) {
            const usuarioFound = await usuarioRepository.findOneBy({ id_usuario });
            if (!usuarioFound) {
                return [null, `El usuario con ID ${id_usuario} no existe.`];
            }
            menuFound.usuario = usuarioFound;
            console.log("Usuario actualizado:", usuarioFound);
        }

        // Validar y actualizar los platillos asociados si se proporciona el array `platillos`
        if (platillos && platillos.length > 0) {
            const platilloIds = platillos.map((p) => p.id_platillo);
            const platillosValidos = await platilloRepository.findByIds(platilloIds);

            // Verificar si todos los platillos proporcionados existen
            if (platillosValidos.length !== platilloIds.length) {
                return [null, "Uno o más IDs de platillos proporcionados no existen."];
            }

            // Actualizar la relación many-to-many
            menuFound.platillo = platillosValidos;
            console.log("Platillos actualizados:", platillosValidos);
        }
        // Guardar el menú actualizado en la base de datos
        const updatedMenu = await menuRepository.save(menuFound);

        console.log("Menú después de la actualización:", updatedMenu);

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


// Función para eliminar un menú por su ID
export async function deleteMenuByIdService(id_menu) {
    try {
        const menuRepository = AppDataSource.getRepository(Menu);
        // Buscar el menú por su ID
        const menuFound = await menuRepository.findOne({
            where: { id_menu },
            relations: ["platillo", "usuario"],
        });
        // Verificar si el menú existe
        if (!menuFound) return [null, { dataInfo: "id_menu", message: `El menú con ID ${id_menu} no existe.` }];
        // Eliminar el menú
        const menuDeleted = await menuRepository.remove(menuFound);

        return [menuDeleted, null];

    } catch (error) {
        console.error("Error al eliminar un menu:", error);
        return [null, "Error interno del servidor"];

    }
}
// Función para activar o desactivar un menú
export async function activarMenuService(id_menu) {
    const menuRepository = AppDataSource.getRepository(Menu);

    try {
        // Buscar el menú
        const menuFound = await menuRepository.findOne({ where: { id_menu } });
        // Verificar si el menú existe
        if (!menuFound) {
            throw new Error(`El menú con ID ${id_menu} no existe.`);
        }

        // Alternar la disponibilidad del menú
        const nuevaDisponibilidad = !menuFound.disponibilidad;

        // Si se está activando, desactivar otros menús
        if (nuevaDisponibilidad) {
            await menuRepository.update({ disponibilidad: true }, { disponibilidad: false });
        }

        // Actualizar la disponibilidad del menú seleccionado
        menuFound.disponibilidad = nuevaDisponibilidad;
        const updatedMenu = await menuRepository.save(menuFound);

        return [updatedMenu, null];
    } catch (error) {
        console.error("Error al alternar la disponibilidad del menú:", error.message);
        return [null, error.message];
    }
}

