import { AppDataSource } from "../config/configDb.js";
import UnidadMedida from "../entity/unidad_medida.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";

// Servicio para crear una unidad de medida
export async function createUnidadMedidaService(data) {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
        const { nombre_unidad_medida } = data;

        console.log("Parámetro de nombre de unidad de medida:", nombre_unidad_medida);

        // Normalizar el nombre de la unidad de medida
        const nombre_normalizado = nombre_unidad_medida
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
            .toLowerCase();

        console.log("Nombre normalizado:", nombre_normalizado);

        // Verificar si la unidad de medida ya existe
        const existingUnidadMedida = await unidadMedidaRepository
            .createQueryBuilder("unidad_medida")
            .where("LOWER(unaccent(unidad_medida.nombre_unidad_medida)) = :nombre", { nombre: nombre_normalizado })
            .getOne();

        if (existingUnidadMedida) {
            return [null, `La unidad de medida '${nombre_unidad_medida}' ya existe.`];
        }

       // Formatear el nombre (primera letra en mayúscula)
       const nombre_formateado = nombre_normalizado.charAt(0).toUpperCase() + nombre_normalizado.slice(1);
       console.log("Nombre formateado a guardar:", nombre_formateado);

       //  Crear y guardar la nueva unidad de medida
       const newUnidadMedida = unidadMedidaRepository.create({
           nombre_unidad_medida: nombre_formateado, // Guardar el formateado
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
        const { nombre_unidad_medida } = data;

        console.log("Nombre de unidad de medida a actualizar:", nombre_unidad_medida);

        // Validar si el nombre es válido y no nulo
        if (!nombre_unidad_medida) {
            return [null, "El nombre de la unidad de medida no puede estar vacío."];
        }

        //  Normalizar el nombre para comparación (eliminar tildes, minúsculas)
        const nombre_normalizado = nombre_unidad_medida
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
            .toLowerCase();

        // Verificar si otro registro tiene el mismo nombre normalizado
        const existingUnidadMedida = await unidadMedidaRepository
            .createQueryBuilder("unidad_medida")
            .where("LOWER(unaccent(unidad_medida.nombre_unidad_medida)) = :nombre", { nombre: nombre_normalizado })
            .andWhere("unidad_medida.id_unidad_medida != :id", { id }) // Excluir el actual
            .getOne();

        if (existingUnidadMedida) {
            return [null, `La unidad de medida '${nombre_unidad_medida}' ya existe.`];
        }

        // Formatear el nombre (primera letra en mayúscula, resto en minúsculas)
        const nombre_formateado = nombre_normalizado.charAt(0).toUpperCase() + nombre_normalizado.slice(1);
        console.log("Nombre formateado a guardar:", nombre_formateado);

        //  Actualizar el registro con el nombre formateado
        await unidadMedidaRepository.update(id, { nombre_unidad_medida: nombre_formateado });

        //  Obtener la unidad de medida actualizada
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
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const unidadMedida = await unidadMedidaRepository.findOneBy({ id_unidad_medida: id });
        if (!unidadMedida) {
            return [null, `La unidad de medida con ID ${id} no existe.`];
        }
        const tipoIngrediente = await tipoIngredienteRepository.findOne({
             where: { unidad_medida: { id_unidad_medida: id } } });

        if (tipoIngrediente) {
            return [null, `No se puede eliminar esta unidad de medida  porque está siendo utilizado
            en uno o más tipos de ingredientes.`];
        }
        
          await unidadMedidaRepository.delete(id);
        return [unidadMedida, null];
    } catch (error) {
        console.error("Error al eliminar la unidad de medida:", error);
        return [null, error.message];
    }
}