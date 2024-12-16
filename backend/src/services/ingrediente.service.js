"use strict";
import { AppDataSource } from "../config/configDb.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import UnidadMedida from "../entity/unidad_medida.entity.js";
import CompuestoIngrediente from "../entity/compuesto_ingrediente.js";

// Servicio para crear un ingrediente
export async function createIngredienteService(data) {
    console.log("En el servicio")
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);
    const compuestoIngredienteRepository = AppDataSource.getRepository(CompuestoIngrediente);

    try {
        const {
            fecha_vencimiento,
            cantidad_ingrediente,
            cantidad_original_ingrediente,
            costo_ingrediente,
            id_tipo_ingrediente,
            id_pedido,
        } = data;

        // Verificar que el tipo de ingrediente existe
        const tipoIngrediente = await tipoIngredienteRepository.findOne({
            where: { id_tipo_ingrediente },
            relations: ["unidad_medida"],
        });

        if (!tipoIngrediente) {
            return [null, "El tipo de ingrediente especificado no existe"];
        }

        // Crear el ingrediente
        const newIngrediente = ingredienteRepository.create({
            fecha_vencimiento,
            cantidad_ingrediente,
            cantidad_original_ingrediente,
            costo_ingrediente,
            tipo_ingrediente: tipoIngrediente,
        });

        await ingredienteRepository.save(newIngrediente);

        // Si id_pedido está presente, agregarlo a la tabla intermedia
        if (id_pedido) {
            console.log("Guardando en compuesto_ingrediente:", {
                id_pedido,
                id_ingrediente: newIngrediente.id_ingrediente,
                cantidad_pedida: cantidad_ingrediente,
            });

            const compuestoIngrediente = compuestoIngredienteRepository.create({
                id_pedido,
                id_ingrediente: newIngrediente.id_ingrediente,
                cantidad_pedida: cantidad_ingrediente, // Usar cantidad ingresada como cantidad pedida
            });

            // Validar antes de guardar
            if (!compuestoIngrediente.id_pedido || !compuestoIngrediente.id_ingrediente) {
                throw new Error(
                    `Datos incompletos para compuesto_ingrediente: ${JSON.stringify(compuestoIngrediente)}`
                );
            }

            await compuestoIngredienteRepository.save(compuestoIngrediente);
        } else {
            console.warn(`id_pedido es nulo, no se guardará en compuesto_ingrediente.`);
        }


        // Obtener el ingrediente con todas las relaciones
        const savedIngrediente = await ingredienteRepository.findOne({
            where: { id_ingrediente: newIngrediente.id_ingrediente },
            relations: { tipo_ingrediente: { unidad_medida: true }, compuesto_ingrediente: { pedido: true } },
        });

        return [savedIngrediente, null];
    } catch (error) {
        console.error("Error al crear el ingrediente:", error);
        return [null, error.message];
    }
}

  
  

// Servicio para obtener todos los ingredientes
export async function getIngredientesService() {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
  
    try {
      const ingredientes = await ingredienteRepository.find({
        relations: {
          tipo_ingrediente: true, // Relación con el tipo de ingrediente
          compuesto_ingrediente: { pedido: true }, // Relación con la tabla intermedia y pedidos
        },
      });
  
      return [ingredientes, null];
    } catch (error) {
      console.error("Error al obtener los ingredientes:", error);
      return [null, error.message];
    }
  }
  


// Servicio para obtener un ingrediente por ID
export async function getIngredienteByIdService(id_ingrediente) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        const ingrediente = await ingredienteRepository.findOneBy(
            { id_ingrediente }, { relations: { tipo_ingrediente: { unidad_medida: true } } });

        if (!ingrediente) {
            return [null, `El ingrediente con ID ${id_ingrediente} no existe.`];
        }

        return [ingrediente, null];
    } catch (error) {
        console.error("Error al obtener el ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un ingrediente
export async function updateIngredienteService(id_ingrediente, data) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const { fecha_vencimiento, cantidad_ingrediente, cantidad_original_ingrediente, 
            costo_ingrediente, id_tipo_ingrediente } = data;

        // Verificar que el ingrediente existe
        const ingredienteExistente = await ingredienteRepository.findOne({
            where: { id_ingrediente },
            relations: { tipo_ingrediente: { unidad_medida: true } },
        });

        if (!ingredienteExistente) {
            return [null, `El ingrediente con ID ${id_ingrediente} no existe.`];
        }

        // Validar que el tipo de ingrediente existe (si se envió uno nuevo)
        let tipoIngrediente = ingredienteExistente.tipo_ingrediente;
        if (id_tipo_ingrediente && id_tipo_ingrediente !== tipoIngrediente?.id_tipo_ingrediente) {
            tipoIngrediente = await tipoIngredienteRepository.findOne({
                where: { id_tipo_ingrediente },
                relations: ["unidad_medida"],
            });

            if (!tipoIngrediente) {
                return [null, `El tipo de ingrediente con ID ${id_tipo_ingrediente} no existe.`];
            }
        }

       // Actualizar los campos del ingrediente
       ingredienteExistente.fecha_vencimiento = fecha_vencimiento;
       ingredienteExistente.cantidad_ingrediente = cantidad_ingrediente;
       ingredienteExistente.cantidad_original_ingrediente = cantidad_original_ingrediente;
       ingredienteExistente.costo_ingrediente = costo_ingrediente;
       ingredienteExistente.tipo_ingrediente = tipoIngrediente;
    

       await ingredienteRepository.save(ingredienteExistente);

       // Obtener nuevamente para incluir todas las relaciones
       const updatedIngrediente = await ingredienteRepository.findOne({
           where: { id_ingrediente },
           relations: { tipo_ingrediente: { unidad_medida: true } },
       });

       return [updatedIngrediente, null];
    } catch (error) {
        console.error("Error al actualizar el ingrediente:", error);
        return [null, error.message];
    }
}


// Servicio para eliminar un ingrediente
export async function deleteIngredienteService(id_ingrediente) {
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {

        if(!id_ingrediente){
            return [null, "ID de ingrediente no válido."]
        }
        // Verificar que el ingrediente existe
        const ingredienteExistente = await ingredienteRepository.findOne({
            where: { id_ingrediente },
            relations: { tipo_ingrediente: { unidad_medida: true } },
        });

        if (!ingredienteExistente) {
            return [null, `El ingrediente con ID ${id_ingrediente} no existe.`];
        }

        // Eliminar el ingrediente
        await ingredienteRepository.remove(ingredienteExistente);

        return [ingredienteExistente, null];
    } catch (error) {
        console.error("Error al eliminar el ingrediente:", error);
        return [null, error.message];
    }
}


// Servicio para crear un tipo de ingrediente
export async function createTipoIngredienteService(data) {
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const { nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente, id_unidad_medida } = data;

        // Validar que la unidad de medida existe
        let unidadMedidaExistente = null;
        if (id_unidad_medida) {
            unidadMedidaExistente = await unidadMedidaRepository.findOneBy({ id_unidad_medida });
            if (!unidadMedidaExistente) {
                return [null, `La unidad de medida con ID ${id_unidad_medida} no existe.`];
            }
        }

        // Crear el tipo de ingrediente
        const newTipoIngrediente = tipoIngredienteRepository.create({
            nombre_tipo_ingrediente,
            cantidad_alerta_tipo_ingrediente,
            unidad_medida: unidadMedidaExistente,
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
        const tipos = await tipoIngredienteRepository.find( {
             relations: ["unidad_medida"] }
        );

        return [tipos, null];
    } catch (error) {
        console.error("Error al obtener los tipos de ingredientes:", error);
        return [null, error.message];
    }
}

// Servicio para obtener un tipo de ingrediente por ID
export async function getTipoIngredienteByIdService(id_tipo_ingrediente) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        const tipoIngrediente = await tipoIngredienteRepository.findOne({
            where: { id_tipo_ingrediente },
            relations: ["unidad_medida"] // Incluye la relación con unidad_medida
        });

        if (!tipoIngrediente) {
            return [null, `El tipo de ingrediente con ID ${id_tipo_ingrediente} no existe.`];
        }

        return [tipoIngrediente, null];
    } catch (error) {
        console.error("Error al obtener el tipo de ingrediente:", error);
        return [null, error.message];
    }
}

// Servicio para actualizar un tipo de ingrediente
export async function updateTipoIngredienteService(id_tipo_ingrediente, data) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);
    const unidadMedidaRepository = AppDataSource.getRepository(UnidadMedida);

    try {
        const { id_unidad_medida, nombre_tipo_ingrediente, cantidad_alerta_tipo_ingrediente } = data;

         // Verificar que el tipo de ingrediente existe
         const tipoIngredienteExistente = await tipoIngredienteRepository.findOne({
            where: { id_tipo_ingrediente },
        });

        if (!tipoIngredienteExistente) {
            return [null, `El tipo de ingrediente con ID ${id} no existe.`];
        }

        // Validar que la unidad de medida existe si se proporciona
        let unidadMedidaExistente = null;
        if (id_unidad_medida) {
            unidadMedidaExistente = await unidadMedidaRepository.findOneBy({ id_unidad_medida });
            if (!unidadMedidaExistente) {
                return [null, `La unidad de medida con ID ${id_unidad_medida} no existe.`];
            }
        }

       

         // Actualizar el tipo de ingrediente
        const updatedTipoIngrediente = {
            ...tipoIngredienteExistente,
            nombre_tipo_ingrediente: nombre_tipo_ingrediente ?? tipoIngredienteExistente.nombre_tipo_ingrediente,
            cantidad_alerta_tipo_ingrediente:
             cantidad_alerta_tipo_ingrediente ?? tipoIngredienteExistente.cantidad_alerta_tipo_ingrediente,
            unidad_medida: unidadMedidaExistente ?? tipoIngredienteExistente.unidad_medida,
        };

        await tipoIngredienteRepository.save(updatedTipoIngrediente);

        // Devolver los datos actualizados con relaciones
        const savedTipoIngrediente = await tipoIngredienteRepository.findOne({
            where: { id_tipo_ingrediente },
            relations: ["unidad_medida"],
        });

        return [savedTipoIngrediente, null];
    } catch (error) {
        console.error("Error al actualizar el tipo de ingrediente:", error);
        return [null, error.message];
    }
}

export async function deleteTipoIngredienteService(id) {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        // Verificar que el tipo de ingrediente existe
        const tipoIngredienteExistente = await tipoIngredienteRepository.findOne({
            where: { id_tipo_ingrediente: id },
        });

        if (!tipoIngredienteExistente) {
            return [null, `El tipo de ingrediente con ID ${id} no existe.`];
        }
        const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
        const ingrediente = await ingredienteRepository.findOne({
            where: { tipo_ingrediente: { id_tipo_ingrediente: id } },
        });

        if (ingrediente) {
            return [null, `No se puede eliminar este tipo de ingrediente porque está siendo utilizado
            en uno o más ingredientes.`];
        }

        // Intentar eliminar el tipo de ingrediente
        await tipoIngredienteRepository.delete(id);
        return [true, null];
    } catch (error) {
        // Verificar si el error es de clave foránea
        if (error.code === "23503") { // Código de error para violación de clave foránea en PostgreSQL
            return [null, `No se puede eliminar este tipo de ingrediente porque está siendo utilizado
                en uno o más platillos.`];
                
        }
        console.error("Error al eliminar el tipo de ingrediente:", error);
        return [null, error.message];
    }
}


