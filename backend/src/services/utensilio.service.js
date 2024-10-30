"use strict";
import { AppDataSource } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js";
import TipoUtensilio from "../entity/tipo_utensilio.entity.js";

// Servicio para crear un tipo de utensilio
export async function createTipoUtensilioService(data) {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const { nombre_tipo_utensilio } = data;
        const newTipoUtensilio = tipoUtensilioRepository.create({ nombre_tipo_utensilio });
        await tipoUtensilioRepository.save(newTipoUtensilio);
        return [newTipoUtensilio, null];
    } catch (error) {
        console.error("Error al crear el tipo de utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para obtener un tipo de utensilio específico
export async function getTipoUtensilioService(id) {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const tipoUtensilio = await tipoUtensilioRepository.findOneBy({ id_tipo_utensilio: id });
        return tipoUtensilio ? [tipoUtensilio, null] : [null, "Tipo de utensilio no encontrado"];
    } catch (error) {
        console.error("Error al obtener el tipo de utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para obtener todos los tipos de utensilios
export async function getTiposUtensilioService() {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const tiposUtensilio = await tipoUtensilioRepository.find();
        return [tiposUtensilio, null];
    } catch (error) {
        console.error("Error al obtener los tipos de utensilios:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un tipo de utensilio
export async function updateTipoUtensilioService(id, data) {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const tipoUtensilio = await tipoUtensilioRepository.findOneBy({ id_tipo_utensilio: id });
        if (!tipoUtensilio) return [null, "Tipo de utensilio no encontrado"];
        tipoUtensilioRepository.merge(tipoUtensilio, data);
        await tipoUtensilioRepository.save(tipoUtensilio);
        return [tipoUtensilio, null];
    } catch (error) {
        console.error("Error al actualizar el tipo de utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para eliminar un tipo de utensilio
export async function deleteTipoUtensilioService(id) {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const result = await tipoUtensilioRepository.delete(id);
        return [result.affected > 0, null];
    } catch (error) {
        console.error("Error al eliminar el tipo de utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para crear un utensilio
export async function createUtensilioService(data) {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const { cantidad_utensilio, id_tipo_utensilio } = data;
        const tipoUtensilio = await tipoUtensilioRepository.findOneBy({ id_tipo_utensilio });
        if (!tipoUtensilio) return [null, `El tipo de utensilio con ID ${id_tipo_utensilio} no existe`];
        const newUtensilio = utensilioRepository.create({ cantidad_utensilio, tipo_utensilio: tipoUtensilio });
        await utensilioRepository.save(newUtensilio);
        return [newUtensilio, null];
    } catch (error) {
        console.error("Error al crear el utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para obtener un utensilio específico
export async function getUtensilioService(id) {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    try {
        const utensilio = await utensilioRepository.findOne({
            where: { id_utensilio: id },
            relations: ["tipo_utensilio"]
        });
        return utensilio ? [utensilio, null] : [null, "Utensilio no encontrado"];
    } catch (error) {
        console.error("Error al obtener el utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para obtener todos los utensilios
export async function getUtensiliosService() {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    try {
        const utensilios = await utensilioRepository.find({ relations: ["tipo_utensilio"] });
        return [utensilios, null];
    } catch (error) {
        console.error("Error al obtener los utensilios:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un utensilio
export async function updateUtensilioService(id, data) {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    try {
        const utensilio = await utensilioRepository.findOneBy({ id_utensilio: id });
        if (!utensilio) return [null, "Utensilio no encontrado"];

        if (data.id_tipo_utensilio) {
            const tipoUtensilio = await tipoUtensilioRepository.findOneBy({ id_tipo_utensilio: data.id_tipo_utensilio });
            if (!tipoUtensilio) return [null, `El tipo de utensilio con ID ${data.id_tipo_utensilio} no existe`];
            data.tipo_utensilio = tipoUtensilio;
            delete data.id_tipo_utensilio;
        }

        utensilioRepository.merge(utensilio, data);
        await utensilioRepository.save(utensilio);
        return [utensilio, null];
    } catch (error) {
        console.error("Error al actualizar el utensilio:", error);
        return [null, error.message];
    }
}

// Servicio para eliminar un utensilio
export async function deleteUtensilioService(id) {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    try {
        const result = await utensilioRepository.delete(id);
        return [result.affected > 0, null];
    } catch (error) {
        console.error("Error al eliminar el utensilio:", error);
        return [null, error.message];
    }
}
