"use strict";
import Platillo from "../entity/platillo.entity.js";

export async function createPlatillo(platilloData) {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);
        const { nombre_platillo, precio_platillo, id_usuario } = platilloData;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message,
        });

    // validar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOne(id_usuario);
        if (!usuarioExistente) {
            return [null, createErrorMessage("id_usuario", `El usuario con ID ${id_usuario} no existe.`)];
        }

        const newPlatillo = platilloRepository.create({
            nombre_platillo,
            precio_platillo,
            usuario: usuarioExistente,
    
        });

        await platilloRepository.save(newPlatillo);

        return [newPlatillo, null];

    } catch (error) {
        console.error("Error al crear el platillo", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getPlatillos() {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);

        const platillos = await platilloRepository.find({
            relations: ["usuario"],
        });

        return [platillos, null];
    } catch (error) {
        console.error("Error al obtener los platillos", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getPlatilloById(id_platillo) {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);

        const platilloItem = await platilloRepository.findOne({
            where: { id_platillo },
            relations: ["usuario"],
        });

        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }

        return [platilloItem, null];
    } catch (error) {
        console.error("Error al obtener el platillo", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deletePlatilloById(id_platillo) {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);

        const platilloItem = await platilloRepository.findOne({
            where: { id_platillo },
        });

        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }

        await platilloRepository.remove(platilloItem);

        return [platilloItem, null];
    } catch (error) {
        console.error("Error al eliminar el platillo", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updatePlatilloById(id_platillo, platilloData) {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);
        const { nombre_platillo,  precio_platillo, id_usuario } = platilloData;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message,
        });

        // validar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOne(id_usuario);
        if (!usuarioExistente) {
            return [null, createErrorMessage("id_usuario", `El usuario con ID ${id_usuario} no existe.`)];
        }

        const platilloItem = await platilloRepository.findOne({
            where: { id_platillo },
            relations: ["usuario"],
        });

        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }

        platilloItem.nombre_platillo = nombre_platillo;
        platilloItem.precio_platillo = precio_platillo;

        await platilloRepository.save(platilloItem);

        return [platilloItem, null];
    } catch (error) {
        console.error("Error al actualizar el platillo", error);
        return [null, "Error interno del servidor"];
    }
}
