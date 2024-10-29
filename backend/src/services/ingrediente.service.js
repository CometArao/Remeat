"use strict";
import { AppDataSource } from "../config/configDb.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";

// Servicio para crear un ingrediente
export async function createIngredienteService(data) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const { fecha_vencimiento, cantidad_ingrediente, id_tipo_ingrediente } = data;

        // Verificar que el tipo de ingrediente existe
        const tipoIngrediente = await tipoIngredienteRepository.findOneBy({ id_tipo_ingrediente });
        if (!tipoIngrediente) {
            return [null, "El tipo de ingrediente especificado no existe"];
        }

        // Crear el ingrediente
        const newIngrediente = ingredienteRepository.create({
            fecha_vencimiento,
            cantidad_ingrediente,
            tipo_ingrediente: tipoIngrediente,
        });
        await ingredienteRepository.save(newIngrediente);

        return [newIngrediente, null];
    } catch (error) {
        console.error("Error al crear el ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para obtener todos los ingredientes
export async function getIngredientesService() {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        const ingredientes = await ingredienteRepository.find({ relations: { tipo_ingrediente: true } });
        return [ingredientes, null];
    } catch (error) {
        console.error("Error al obtener los ingredientes:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un ingrediente
export async function updateIngredienteService(id, data) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        await ingredienteRepository.update(id, data);
        const updatedIngrediente = await ingredienteRepository.findOneBy({ id_ingrediente: id });
        return [updatedIngrediente, null];
    } catch (error) {
        console.error("Error al actualizar el ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para eliminar un ingrediente
export async function deleteIngredienteService(id) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        await ingredienteRepository.delete(id);
        return [true, null];
    } catch (error) {
        console.error("Error al eliminar el ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para crear un tipo de ingrediente
export async function createTipoIngredienteService(data) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const { nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente } = data;

        // Crear el tipo de ingrediente
        const newTipoIngrediente = tipoIngredienteRepository.create({
            nombre_tipo_ingrediente,
            cantidad_alerta_tipo_ingrediente,
        });
        await tipoIngredienteRepository.save(newTipoIngrediente);

        return [newTipoIngrediente, null];
    } catch (error) {
        console.error("Error al crear el tipo de ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para obtener todos los tipos de ingredientes
export async function getTipoIngredientesService() {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const tipos = await tipoIngredienteRepository.find();
        return [tipos, null];
    } catch (error) {
        console.error("Error al obtener los tipos de ingredientes:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un tipo de ingrediente
export async function updateTipoIngredienteService(id, data) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        await tipoIngredienteRepository.update(id, data);
        const updatedTipoIngrediente = await tipoIngredienteRepository.findOneBy({ id_tipo_ingrediente: id });
        return [updatedTipoIngrediente, null];
    } catch (error) {
        console.error("Error al actualizar el tipo de ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para eliminar un tipo de ingrediente
export async function deleteTipoIngredienteService(id) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        await tipoIngredienteRepository.delete(id);
        return [true, null];
    } catch (error) {
        console.error("Error al eliminar el tipo de ingrediente:", error);
        return [null, error.message];
    }
}
