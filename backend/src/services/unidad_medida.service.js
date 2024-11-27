import { AppDataSource } from "../config/configDb.js";
import UnidadMedida from "../entity/unidad_medida.entity.js";

// Servicio para crear una unidad de medida
export async function createUnidadMedidaService(data) {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
    
         const { nombre_unidad_medida } = data;
    /*Normalizar y convertir a minúsculas el nombre de la unidad de medida
    const normalizedNombre = nombre_unidad_medida
        .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Verificar si la unidad de medida ya existe
    const existingUnidadMedida = await unidadMedidaRepository.findOneBy({
      nombre_unidad_medida: normalizedNombre,
    });

    if (existingUnidadMedida) {
      return [null, `La unidad de medida '${normalizedNombre}' ya existe.`];
    } */
        const newUnidadMedida = unidadMedidaRepository.create({
            nombre_unidad_medida,
        });

        await unidadMedidaRepository.save(newUnidadMedida);

        return [newUnidadMedida, null];
    } catch (error) {
        console.error("Error al crear la unidad de medida:", error);
        return [null, error.message];
    }
}

// Servicio para obtener todas las unidades de medida
export async function getUnidadesMedidasService() {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);
  
    try {
      const unidades = await unidadMedidaRepository.find();
      return [unidades, null];
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
      return [null, error.message];
    }
  }

// Servicio para obtener una unidad de medida por ID
export async function getUnidadMedidaByIdService(id) {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
        const unidad = await unidadMedidaRepository.findOneBy({ id_unidad_medida: id });
        return [unidad, null];
    } catch (error) {
        console.error("Error al obtener la unidad de medida:", error);
        return [null, error.message];
    }
}
// Servicio para actualizar una unidad de medida
export async function updateUnidadMedidaService(id, data) {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
        await unidadMedidaRepository.update(id, data);
        const updatedUnidadMedida = await unidadMedidaRepository.findOneBy({ id_unidad_medida: id });
        return [updatedUnidadMedida, null];
    } catch (error) {
        console.error("Error al actualizar la unidad de medida:", error);
        return [null, error.message];
    }
}
// Servicio para eliminar una unidad de medida
export async function deleteUnidadMedidaService(id) {

    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
        const unidadMedida = await unidadMedidaRepository.findOneBy({ id_unidad_medida: id });
        if (!unidadMedida) {
            return [null, `La unidad de medida con ID ${id} no existe.`];
        }

        await unidadMedidaRepository.delete(id);
        return [unidadMedida, null];
    } catch (error) {
        console.error("Error al eliminar la unidad de medida:", error);
        return [null, error.message];
    }
}