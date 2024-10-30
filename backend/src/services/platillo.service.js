"use strict";
import { AppDataSource } from "../config/configDb.js";
import Platillo from "../entity/platillo.entity.js";
import Usuario from "../entity/usuario.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import ComponePlatillo from "../entity/compuesto_platillo.entity.js";

export async function createPlatilloService(data) {
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

    try {
        const { nombre_platillo, disponible, id_usuario, ingredientes } = data;

        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message,
        });

        // Verificar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOneBy({ id_usuario });
        if (!usuarioExistente) {
            return [
                null,
                createErrorMessage(
                    "id_usuario",
                    `El usuario con ID ${id_usuario} no existe.`
                ),
            ];
        }

        // Crear el platillo con precio inicial de 0
        const newPlatillo = platilloRepository.create({
            nombre_platillo,
            precio_platillo: 0, // Precio inicial de 0
            disponible,
            creador: usuarioExistente,
        });
        await platilloRepository.save(newPlatillo);

        // Verificar y agregar los ingredientes al platillo
        if (ingredientes && ingredientes.length > 0) {
            const ingredientesToAdd = [];

            for (const ingrediente of ingredientes) {
                // Verificar que el tipo de ingrediente existe
                const tipoIngredienteExistente = await tipoIngredienteRepository.findOneBy({
                    id_tipo_ingrediente: ingrediente.id_tipo_ingrediente
                });

                if (!tipoIngredienteExistente) {
                    return [
                        null,
                        createErrorMessage(
                            "id_tipo_ingrediente",
                            `El tipo de ingrediente con ID ${ingrediente.id_tipo_ingrediente} no existe.`
                        ),
                    ];
                }

                // Crear la relación entre el platillo y el ingrediente
                ingredientesToAdd.push(
                    componePlatilloRepository.create({
                        id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                        id_platillo: newPlatillo.id_platillo,
                        porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                    })
                );
            }

            await componePlatilloRepository.save(ingredientesToAdd);
        }

        return [newPlatillo, null];
    } catch (error) {
        console.error("Error al crear el platillo:", error);
        return [null, error.message];
    }
}


export async function assignPriceToPlatilloService(data) {
  const platilloRepository = AppDataSource.getRepository(Platillo);

  try {
      const { id_platillo, precio_platillo } = data;

      // Verificar que el platillo existe
      const platillo = await platilloRepository.findOneBy({ id_platillo });
      if (!platillo) {
          return [null, `El platillo con ID ${id_platillo} no existe.`];
      }

      // Asignar el precio al platillo
      platillo.precio_platillo = precio_platillo;
      await platilloRepository.save(platillo);

      return [platillo, null];
  } catch (error) {
      console.error("Error al asignar precio al platillo:", error);
      return [null, error.message];
  }
}


//Función para obtener todos los platillos
export async function getPlatillosService() {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);

        const platillos = await platilloRepository.find({
            relations: ["creador"],
        });

        return [platillos, null];
    } catch (error) {
        console.error("Error al obtener los platillos", error);
        return [null, "Error interno del servidor"];
    }
}

//Función para obtener un platillo por ID
export async function getPlatilloByIdService(id_platillo) {
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

//Función para eliminar un platillo por ID
export async function deletePlatilloByIdService(id_platillo) {
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

//Función para actualizar un platillo por ID
export async function updatePlatilloByIdService(id_platillo, platilloData) {
  try {
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const { nombre_platillo, precio_platillo, disponible, id_usuario } = platilloData;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const platilloItem = await platilloRepository.findOne({
      where: { id_platillo },
      relations: ["creador"],
    });

    if (!platilloItem) {
      return [
        null,
        createErrorMessage(
          "id_platillo",
          `El platillo con ID ${id_platillo} no existe.`
        ),
      ];
    }

    //  validar que el usuario existe
  
      usuarioExistente = await usuarioRepository.findOneBy({ id_usuario });
      if (!usuarioExistente) {
        return [
          null,
          createErrorMessage(
            "id_usuario",
            `El usuario con ID ${id_usuario} no existe.`
          ),
        ];
      }
      platilloItem.creador = usuarioExistente;
    

    // Actualizar otros campos
    if (nombre_platillo !== undefined) {
      platilloItem.nombre_platillo = nombre_platillo;
    }

    if (precio_platillo !== undefined) {
      platilloItem.precio_platillo = precio_platillo;
    }

    if (disponible !== undefined) {
      platilloItem.disponible = disponible;
    }

    await platilloRepository.save(platilloItem);

    return [platilloItem, null];
  } catch (error) {
    console.error("Error al actualizar el platillo", error);
    return [null, "Error interno del servidor"];
  }
}
