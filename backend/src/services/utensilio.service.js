/* eslint-disable max-len */
"use strict";
import { AppDataSource } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js";
import TipoUtensilio from "../entity/tipo_utensilio.entity.js";
import CompuestoUtensilio from "../entity/compuesto_utensilio.js";

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
    const compuestoUtensilioRepository = AppDataSource.getRepository(CompuestoUtensilio);

    try {
        const { cantidad_utensilio, costo_utensilio, id_tipo_utensilio, id_pedido } = data;

        // Verificar que el tipo de utensilio existe
        const tipoUtensilio = await tipoUtensilioRepository.findOne({
            where: { id_tipo_utensilio },
        });

        if (!tipoUtensilio) {
            return [null, `El tipo de utensilio especificado con ID ${id_tipo_utensilio} no existe`];
        }

        // Crear el utensilio
        const newUtensilio = utensilioRepository.create({
            cantidad_utensilio: cantidad_utensilio,
            cantidad_restante_utensilio: cantidad_utensilio,
            tipo_utensilio: tipoUtensilio,
            costo_utensilio: costo_utensilio
        });
        await utensilioRepository.save(newUtensilio);

        // Si id_pedido está presente, agregarlo a la tabla intermedia
        if (id_pedido) {
            console.log("Guardando en compuesto_utensilio:", {
                id_pedido,
                id_utensilio: newUtensilio.id_utensilio,
                cantidad_pedida: cantidad_utensilio,
            });

            const compuestoUtensilio = compuestoUtensilioRepository.create({
                id_pedido,
                id_utensilio: newUtensilio.id_utensilio,
                cantidad_pedida: cantidad_utensilio,
            });

            // Validar antes de guardar
            if (!compuestoUtensilio.id_pedido || !compuestoUtensilio.id_utensilio) {
                throw new Error(
                    `Datos incompletos para compuesto_utensilio: ${JSON.stringify(compuestoUtensilio)}`
                );
            }

            await compuestoUtensilioRepository.save(compuestoUtensilio);
        } else {
            console.warn(`id_pedido es nulo, no se guardará en compuesto_utensilio.`);
        }

        // Obtener el utensilio con todas las relaciones
        const savedUtensilio = await utensilioRepository.findOne({
            where: { id_utensilio: newUtensilio.id_utensilio },
            relations: { tipo_utensilio: true },
        });

        return [savedUtensilio, null];
    } catch (error) {
        console.error("Error al crear el utensilio:", error);
        return [null, error.message];
    }
}
export async function getUtensiliosService() {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    try {
        const utensilios = await utensilioRepository.find({
            relations: {
                tipo_utensilio: true // Relación válida
                //pedido: true
            },
        });

        return [utensilios, null];
    } catch (error) {
        console.error("Error al obtener los utensilios:", error);
        return [null, error.message];
    }
}

export async function getUtensiliosDetalladoService() {
    try {
        const utensilios = await AppDataSource.query(`
   select *
   from utensilio u
   inner join tipo_utensilio tu on u.id_tipo_utensilio = tu.id_tipo_utensilio 
   inner join compuesto_utensilio cu on cu.id_utensilio = u.id_utensilio 
   inner join pedido p on p.id_pedido = cu.id_pedido          
        `)
        return [utensilios, null];
    } catch (error) {
        console.error("Error al obtener los utensilios:", error);
        return [null, error.message];
    }
}

// Servicio para obtener un utensilio específico
export async function getUtensilioService(id) {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    try {
        const utensilio = await utensilioRepository.findOne({
            where: { id_utensilio: id },
            relations: { tipo_utensilio: true }, // Relación válida
        });

        return utensilio ? [utensilio, null] : [null, "Utensilio no encontrado"];
    } catch (error) {
        console.error("Error al obtener el utensilio:", error);
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
