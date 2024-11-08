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
        
          // Procesar y agregar los ingredientes usando map
          const ingredientesToAdd = await Promise.all(
            ingredientes.map(async (ingrediente) => {
                // Verificar que el tipo de ingrediente existe
                const tipoIngredienteExistente = await tipoIngredienteRepository.findOne({
                    where: { id_tipo_ingrediente: ingrediente.id_tipo_ingrediente },
                    relations: ["unidad_medida"], // Incluir la unidad de medida
                });

                if (!tipoIngredienteExistente) {
                    throw new Error(
                        `El tipo de ingrediente con ID ${ingrediente.id_tipo_ingrediente} no existe.`
                    );
                }

                // Crear la relación entre el platillo y el ingrediente
                await componePlatilloRepository.save({
                    id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                    id_platillo: newPlatillo.id_platillo,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                });

                // Estructurar el ingrediente con unidad de medida para la respuesta
                return {
                    id_tipo_ingrediente: tipoIngredienteExistente.id_tipo_ingrediente,
                    nombre_tipo_ingrediente: tipoIngredienteExistente.nombre_tipo_ingrediente,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                    unidad_medida: tipoIngredienteExistente.unidad_medida
                        ? {
                            id_unidad_medida: tipoIngredienteExistente.unidad_medida.id_unidad_medida,
                            nombre_unidad_medida: tipoIngredienteExistente.unidad_medida.nombre_unidad_medida,
                        }
                        : null,
                };
            })
        );

        // Separar el creador para la estructura de respuesta
        const creadorInfo = {
            id_usuario: usuarioExistente.id_usuario,
            nombre_usuario: usuarioExistente.nombre_usuario,
            apellido_usuario: usuarioExistente.apellido_usuario,
            correo_usuario: usuarioExistente.correo_usuario,
            rol_usuario: usuarioExistente.rol_usuario,
        };

        // Estructura de respuesta final
        const responseData = {
            id_platillo: newPlatillo.id_platillo,
            nombre_platillo: newPlatillo.nombre_platillo,
            precio_platillo: newPlatillo.precio_platillo,
            disponible: newPlatillo.disponible,
            creador: creadorInfo,
            ingredientes: ingredientesToAdd,
        };

        return [responseData, null];
  
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
    const { nombre_platillo, precio_platillo, disponible, id_usuario, ingredientes } = platilloData;

    // Buscar el platillo existente
    const platilloItem = await platilloRepository.findOne({
        where: { id_platillo },
        relations: ["creador"],
    });

    if (!platilloItem) {
        return [
            null,
            `El platillo con ID ${id_platillo} no existe.`,
        ];
    }

    // Validar que el usuario (creador) existe, si se proporciona un nuevo `id_usuario`
    let usuarioExistente;
    if (id_usuario) {
        usuarioExistente = await usuarioRepository.findOneBy({ id_usuario });
        if (!usuarioExistente) {
            return [
                null,
                `El usuario con ID ${id_usuario} no existe.`,
            ];
        }
        platilloItem.creador = usuarioExistente;
    }

    // Actualizar los campos del platillo
    if (nombre_platillo !== undefined) platilloItem.nombre_platillo = nombre_platillo;
    if (precio_platillo !== undefined) platilloItem.precio_platillo = precio_platillo;
    if (disponible !== undefined) platilloItem.disponible = disponible;

    await platilloRepository.save(platilloItem);

    // Actualizar ingredientes
    if (ingredientes && ingredientes.length > 0) {
        // Eliminar relaciones existentes de ingredientes
        await componePlatilloRepository.delete({ id_platillo });

        // Agregar nuevas relaciones de ingredientes con `map`
        const ingredientesToAdd = await Promise.all(
            ingredientes.map(async (ingrediente) => {
                const tipoIngredienteExistente = await tipoIngredienteRepository.findOne({
                    where: { id_tipo_ingrediente: ingrediente.id_tipo_ingrediente },
                    relations: ["unidad_medida"], // Incluir la unidad de medida
                });

                if (!tipoIngredienteExistente) {
                    throw new Error(
                        `El tipo de ingrediente con ID ${ingrediente.id_tipo_ingrediente} no existe.`
                    );
                }

                // Guardar la relación en la tabla compuesta `compuesto_platillo`
                await componePlatilloRepository.save({
                    id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                    id_platillo: platilloItem.id_platillo,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                });

                // Estructurar el ingrediente con unidad de medida para la respuesta
                return {
                    id_tipo_ingrediente: tipoIngredienteExistente.id_tipo_ingrediente,
                    nombre_tipo_ingrediente: tipoIngredienteExistente.nombre_tipo_ingrediente,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                    unidad_medida: tipoIngredienteExistente.unidad_medida
                        ? {
                            id_unidad_medida: tipoIngredienteExistente.unidad_medida.id_unidad_medida,
                            nombre_unidad_medida: tipoIngredienteExistente.unidad_medida.nombre_unidad_medida,
                        }
                        : null,
                };
            })
        );

        // Construir la estructura de respuesta con el nuevo array de ingredientes
        const responseData = {
            id_platillo: platilloItem.id_platillo,
            nombre_platillo: platilloItem.nombre_platillo,
            precio_platillo: platilloItem.precio_platillo,
            disponible: platilloItem.disponible,
            creador: {
                id_usuario: platilloItem.creador.id_usuario,
                nombre_usuario: platilloItem.creador.nombre_usuario,
                apellido_usuario: platilloItem.creador.apellido_usuario,
                correo_usuario: platilloItem.creador.correo_usuario,
                rol_usuario: platilloItem.creador.rol_usuario,
            },
            ingredientes: ingredientesToAdd,
        };

        return [responseData, null];
    } else {
        // En caso de que no haya ingredientes para actualizar, devolver el platillo sin ingredientes actualizados
        const responseData = {
            id_platillo: platilloItem.id_platillo,
            nombre_platillo: platilloItem.nombre_platillo,
            precio_platillo: platilloItem.precio_platillo,
            disponible: platilloItem.disponible,
            creador: {
                id_usuario: platilloItem.creador.id_usuario,
                nombre_usuario: platilloItem.creador.nombre_usuario,
                apellido_usuario: platilloItem.creador.apellido_usuario,
                correo_usuario: platilloItem.creador.correo_usuario,
                rol_usuario: platilloItem.creador.rol_usuario,
            },
        };
        return [responseData, null];
  }} catch (error) {
    console.error("Error al actualizar el platillo", error);
    return [null, "Error interno del servidor"];
  }
}
