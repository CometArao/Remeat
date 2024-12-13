"use strict";
import { AppDataSource } from "../config/configDb.js";
import Platillo from "../entity/platillo.entity.js";
import Usuario from "../entity/usuario.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import ComponePlatillo from "../entity/compuesto_platillo.entity.js";
import ConformaComanda from "../entity/conforma_comanda.entity.js";
import Ingrediente from "../entity/ingrediente.entity.js";
import { isAfter } from "date-fns";

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
            disponible: false,
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
        platillo.disponible = true;
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
        const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

        const platillos = await platilloRepository.find({
            relations: ["creador"],
        });


       // Estructurar cada platillo con sus ingredientes
        const platillosEstructurados = await Promise.all(
            platillos.map(async (platillo) => {
                // Buscar los ingredientes asociados al platillo
                const ingredientes = await componePlatilloRepository.find({
                    where: { id_platillo: platillo.id_platillo },
                    relations: ["tipo_ingrediente", "tipo_ingrediente.unidad_medida"],
                });

                // Estructurar los ingredientes con sus tipos y unidad de medida
                const ingredientesEstructurados = ingredientes.map((ingrediente) => ({
                    id_tipo_ingrediente: ingrediente.tipo_ingrediente.id_tipo_ingrediente,
                    nombre_tipo_ingrediente: ingrediente.tipo_ingrediente.nombre_tipo_ingrediente,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                    unidad_medida: ingrediente.tipo_ingrediente.unidad_medida
                        ? {
                            id_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.id_unidad_medida,
                            nombre_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.nombre_unidad_medida,
                        }
                        : null,
                }));

                // Construir la estructura del platillo
                return {
                    id_platillo: platillo.id_platillo,
                    nombre_platillo: platillo.nombre_platillo,
                    precio_platillo: platillo.precio_platillo,
                    disponible: platillo.disponible,
                    creador: {
                        id_usuario: platillo.creador.id_usuario,
                        nombre_usuario: platillo.creador.nombre_usuario,
                        apellido_usuario: platillo.creador.apellido_usuario,
                        correo_usuario: platillo.creador.correo_usuario,
                        rol_usuario: platillo.creador.rol_usuario,
                    },
                    ingredientes: ingredientesEstructurados,
                };
            })
        );

        return [platillosEstructurados, null];
    } catch (error) {
        console.error("Error al obtener los platillos", error);
        return [null, "Error interno del servidor"];
    }
}

//Función para obtener un platillo por ID
export async function getPlatilloByIdService(id_platillo) {
    try {
        const platilloRepository = AppDataSource.getRepository(Platillo);
        const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

        const platilloItem = await platilloRepository.findOne({
            where: { id_platillo },
            relations: ["creador"],
        });

        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }



       const ingredientes = await componePlatilloRepository.find({
            where: { id_platillo },
            relations: ["tipo_ingrediente", "tipo_ingrediente.unidad_medida"],
        });

        const ingredientesEstructurados = ingredientes.map((ingrediente) => ({
            id_tipo_ingrediente: ingrediente.tipo_ingrediente.id_tipo_ingrediente,
            nombre_tipo_ingrediente: ingrediente.tipo_ingrediente.nombre_tipo_ingrediente,
            porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
            unidad_medida: ingrediente.tipo_ingrediente.unidad_medida
                ? {
                    id_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.id_unidad_medida,
                    nombre_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.nombre_unidad_medida,
                }
                : null,
        }));

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
            ingredientes: ingredientesEstructurados,
        };

        return [responseData, null];
    } catch (error) {   
        console.error("Error al obtener el platillo", error);
        return [null, "Error interno del servidor"];
    }
}

//Función para eliminar un platillo por ID
export async function deletePlatilloByIdService(id_platillo) {
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

    try {
        console.log(`Eliminando platillo con ID: ${id_platillo}`); // Registro de eliminación
        // Eliminar registros relacionados en la tabla `compuesto_platillo`
        await componePlatilloRepository.delete({ id_platillo });

        // Ahora eliminar el platillo
        const platilloItem = await platilloRepository.findOne({ where: { id_platillo } });
        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }

        await platilloRepository.remove(platilloItem);
        return [platilloItem, null];
    } catch (error) {
        console.error("Error al eliminar el platillo:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updatePlatilloByIdService(id_platillo, platilloData) {
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

    const { nombre_platillo, disponible, id_usuario, ingredientes } = platilloData;

    try {
        // Buscar el platillo existente
        const platilloFound = await platilloRepository.findOne({
            where: { id_platillo },
            relations: ["creador"],
        });

        if (!platilloFound) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }

        // Actualizar los campos básicos del platillo
        if (nombre_platillo !== undefined) platilloFound.nombre_platillo = nombre_platillo;
        if (disponible !== undefined) platilloFound.disponible = disponible;

        // Validar y actualizar el usuario asociado si se proporciona un nuevo id_usuario
        if (id_usuario !== undefined) {
            const usuarioFound = await usuarioRepository.findOneBy({ id_usuario });
            if (!usuarioFound) {
                return [null, `El usuario con ID ${id_usuario} no existe.`];
            }
            platilloFound.creador = usuarioFound;
        }

        // Guardar cambios básicos del platillo
        await platilloRepository.save(platilloFound);

        // Manejar los ingredientes si se proporcionan
        if (ingredientes && Array.isArray(ingredientes)) {
            // Convertir IDs a enteros y validar
            ingredientes.forEach((ingrediente) => {
                if (typeof ingrediente.id_tipo_ingrediente !== "number") {
                    ingrediente.id_tipo_ingrediente = parseInt(ingrediente.id_tipo_ingrediente, 10);
                }
                if (isNaN(ingrediente.id_tipo_ingrediente)) {
                    throw new Error(`ID de tipo de ingrediente inválido: ${ingrediente.id_tipo_ingrediente}`);
                }
            });

            // Validar los ingredientes existentes
            const ingredienteIds = ingredientes.map((i) => i.id_tipo_ingrediente);
            const ingredientesValidos = await tipoIngredienteRepository.findByIds(ingredienteIds);

            if (ingredientesValidos.length !== ingredienteIds.length) {
                const idsInvalidos = ingredienteIds.filter(
                    (id) => !ingredientesValidos.some((ing) => ing.id_tipo_ingrediente === id)
                );
                return [null, `Uno o más IDs de ingredientes no existen: ${idsInvalidos.join(", ")}`];
            }

            // Actualizar relaciones
            const relacionesActuales = await componePlatilloRepository.find({
                where: { id_platillo },
            });

            const relacionesAEliminar = relacionesActuales.filter(
                (rel) => !ingredienteIds.includes(rel.id_tipo_ingrediente)
            );

            for (const relacion of relacionesAEliminar) {
                await componePlatilloRepository.delete({
                    id_tipo_ingrediente: relacion.id_tipo_ingrediente,
                    id_platillo,
                });
            }

            for (const ingrediente of ingredientes) {
                const relacionExistente = await componePlatilloRepository.findOne({
                    where: {
                        id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                        id_platillo,
                    },
                });

                if (relacionExistente) {
                    relacionExistente.porcion_ingrediente_platillo = ingrediente.porcion_ingrediente_platillo;
                    await componePlatilloRepository.save(relacionExistente);
                } else {
                    await componePlatilloRepository.save({
                        id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                        id_platillo,
                        porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                    });
                }
            }
        }

        // Construir la respuesta final con ingredientes actualizados
        const ingredientesActualizados = await componePlatilloRepository.find({
            where: { id_platillo },
            relations: ["tipo_ingrediente", "tipo_ingrediente.unidad_medida"],
        });

        const ingredientesToAdd = ingredientesActualizados.map((ingrediente) => ({
            id_tipo_ingrediente: ingrediente.tipo_ingrediente.id_tipo_ingrediente,
            nombre_tipo_ingrediente: ingrediente.tipo_ingrediente.nombre_tipo_ingrediente,
            porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
            unidad_medida: ingrediente.tipo_ingrediente.unidad_medida
                ? {
                    id_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.id_unidad_medida,
                    nombre_unidad_medida: ingrediente.tipo_ingrediente.unidad_medida.nombre_unidad_medida,
                }
                : null,
        }));

        const responseData = {
            id_platillo: platilloFound.id_platillo,
            nombre_platillo: platilloFound.nombre_platillo,
            disponible: platilloFound.disponible,
            creador: {
                id_usuario: platilloFound.creador.id_usuario,
                nombre_usuario: platilloFound.creador.nombre_usuario,
                correo_usuario: platilloFound.creador.correo_usuario,
            },
            ingredientes: ingredientesToAdd,
        };

        return [responseData, null];
    } catch (error) {
        console.error("Error al actualizar el platillo:", error.message);
        return [null, "Error interno del servidor"];
    }
}



export async function verificarDisponibilidadPlatillo(id_platillo) {
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        const compuestoPlatillo = await componePlatilloRepository.find({
            where: { id_platillo },
            relations: ["tipo_ingrediente"],
        });

        if (!compuestoPlatillo.length) {
            throw new Error("El platillo no tiene ingredientes asociados o no existe.");
        }

        console.log("Procesando platillo con ID:", id_platillo);
        console.log("Ingredientes asociados:", compuestoPlatillo);

        for (const compuesto of compuestoPlatillo) {
            console.log("Procesando tipo ingrediente:", compuesto.id_tipo_ingrediente);

            // Buscar todos los ingredientes del mismo tipo y no vencidos
            const ingredientes = await ingredienteRepository.find({
                where: { id_tipo_ingrediente: compuesto.id_tipo_ingrediente },
            });

            const fechaActual = new Date();

            const ingredientesValidos = ingredientes.filter((ingrediente) =>
                isAfter(new Date(ingrediente.fecha_vencimiento), fechaActual)
            );

            if (!ingredientesValidos.length) {
                throw new Error(
                    `No hay ingredientes sin caducar  para el tipo de ingrediente con ID 
                    ${compuesto.id_tipo_ingrediente}.`
                );
            }

            // Sumar las cantidades disponibles de ingredientes válidos
            const cantidadTotalDisponible = ingredientesValidos.reduce(
                (total, ingrediente) => total + ingrediente.cantidad_ingrediente,
                0
            );

            console.log(`Cantidad total disponible: ${cantidadTotalDisponible} (solo ingredientes válidos)`);

            const porcionRequerida = compuesto.porcion_ingrediente_platillo;

            if (cantidadTotalDisponible < porcionRequerida) {
                console.error(
                    `No hay suficiente cantidad de "${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}" 
                     en el inventario. Requerido: ${porcionRequerida}, Disponible: ${cantidadTotalDisponible}`
                );
                return false;
            }

            console.log(`Ingrediente disponible: ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}`);
        }

        return true; // Todos los ingredientes tienen suficiente cantidad
    } catch (error) {
        console.error("Error al verificar la disponibilidad del platillo:", error.message);
        throw new Error("Error al verificar la disponibilidad del platillo.");
    }
}
  
  export async function confirmarPlatilloService(id_platillo, id_comanda, nuevo_estado) {
    const conformaRepository = AppDataSource.getRepository(ConformaComanda);
  
    try {
      // Lista de estados válidos y transiciones permitidas
      const estadosValidos = ["pendiente", "preparado", "entregado"];
      const transicionesPermitidas = {
        pendiente: ["preparado"],
        preparado: ["entregado"],
        entregado: []
      };
      console.log("nuevo_estado", nuevo_estado);
  
      // Verificar si el estado nuevo es válido
      if (!estadosValidos.includes(nuevo_estado)) {
        throw new Error(`Estado "${nuevo_estado}" no es válido. Estados válidos: ${estadosValidos.join(", ")}`);
      }
  
      // Buscar el platillo en la comanda
      const conformaPlatillo = await conformaRepository.findOne({
        where: { id_comanda, id_platillo },
        relations: ["platillo"]
      });
      console.log("conformaPlatillo en la comanda", conformaPlatillo);
      if (!conformaPlatillo) {
        throw new Error("El platillo no está asociado a la comanda proporcionada.");
      }
  
      const estadoActual = conformaPlatillo.estado_platillo;
  
      // Validar la transición de estado
      if (!transicionesPermitidas[estadoActual].includes(nuevo_estado)) {
        throw new Error(`Transición no permitida de "${estadoActual}" a "${nuevo_estado}".`);
      }
  
      // Verificar disponibilidad antes de cambiar el estado a "preparado"
      if (nuevo_estado === "preparado") {
        const platilloDisponible = await verificarDisponibilidadPlatillo(id_platillo);
        if (!platilloDisponible) {
          throw new Error(`El platillo "${conformaPlatillo.platillo.nombre_platillo}" no está disponible.`);
        }
         // Descontar ingredientes del inventario
         const cantidadesDescontadas = await descontarIngredientesInventario(id_platillo, id_comanda);
          console.log("Ingredientes descontados del inventario:", cantidadesDescontadas);
}
      // Actualizar el estado del platillo
      conformaPlatillo.estado_platillo = nuevo_estado;
      await conformaRepository.save(conformaPlatillo);
      
      console.log("conformaPlatillo3", conformaPlatillo);
  
      return [conformaPlatillo, null];
    } catch (error) {
      console.error("Error en confirmarPlatilloService:", error.message);
      throw new Error("Error al confirmar el platillo.");
    }
  }

export async function descontarIngredientesInventario(id_platillo, id_comanda) {
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const conformaRepository = AppDataSource.getRepository(ConformaComanda);
  
    try {
        // Buscar relacion entre platillo y comanda 
        const conformaPlatillo = await conformaRepository.findOne({
            where: { id_comanda, id_platillo },
        });
        if (!conformaPlatillo) {
            throw new Error("No se encontró la relación entre el platillo y la comanda.");
        }
        const cantidadPlatillo = conformaPlatillo.cantidad_platillo;
        console.log("Cantidad de platillos:", cantidadPlatillo);


        // Buscar los ingredientes asociados al platillo desde la tabla `compuesto_platillo`
        const compuestosPlatillo = await componePlatilloRepository.find({
        where: { id_platillo },
        relations: ["tipo_ingrediente"],
        select: ["id_tipo_ingrediente", "porcion_ingrediente_platillo"]
            });

        console.log("ingredientes asociados al platillo", compuestosPlatillo);

        if (!compuestosPlatillo.length) {
            throw new Error("El platillo no tiene ingredientes asociados o no existe.");
        }

        let cantidadesDescontadas = 0; // Contador de ingredientes descontados

        for (const compuesto of compuestosPlatillo) {
            const ingrediente = await ingredienteRepository.findOne({
                where: { id_tipo_ingrediente: compuesto.id_tipo_ingrediente }
            });

            if (!ingrediente) {
                throw new Error(`El ingrediente con ID ${compuesto.id_tipo_ingrediente} no existe.`);
            }

            const cantidadDisponible = ingrediente.cantidad_ingrediente;
            const porcionRequerida = compuesto.porcion_ingrediente_platillo * cantidadPlatillo;

            // Verificar si hay suficiente cantidad de ingrediente
            if (cantidadDisponible < porcionRequerida) {
                throw new Error(`No hay suficiente cantidad de "
                    ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}" en el inventario.`);
            }
            console.log("Ingrediente disponible:", compuesto.tipo_ingrediente.nombre_tipo_ingrediente);

            // Descontar la cantidad utilizada
            ingrediente.cantidad_ingrediente -= porcionRequerida;

            // Guardar el cambio en el inventario
            await ingredienteRepository.save(ingrediente);

            // Incrementar el contador de ingredientes descontados
            cantidadesDescontadas+= porcionRequerida;
            

            console.log(`Cantidad de "${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}" descontada.`);
            console.log ("cantidad actual: ", ingrediente.cantidad_ingrediente);

            // Si la cantidad en inventario es menor o igual a la cantidad de alerta, mostrar un mensaje de alerta
            if (ingrediente.cantidad_ingrediente <= compuesto.tipo_ingrediente.cantidad_alerta_tipo_ingrediente) {
                console.warn(`Advertencia: La cantidad de "
                    ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}" está por debajo del nivel de alerta.`);
            }
        }

        // Si alguno de los ingredientes llega a 0, marcar el platillo como no disponible
        const platillo = await platilloRepository.findOneBy({ id_platillo });
        if (compuestosPlatillo.some(com => com.tipo_ingrediente.cantidad_ingrediente <= 0)) {
            platillo.disponible = false;
            await platilloRepository.save(platillo);
        }
       return cantidadesDescontadas; 
    } catch (error) {
        console.error("Error al descontar ingredientes:", error.message);
        throw new Error("Ocurrió un error al descontar los ingredientes del inventario.");
    }
}