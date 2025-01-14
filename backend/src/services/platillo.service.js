"use strict";
import { AppDataSource } from "../config/configDb.js";
import { getSocketInstance } from "../services/socket.js";
import Platillo from "../entity/platillo.entity.js";
import Usuario from "../entity/usuario.entity.js";
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js";
import ComponePlatillo from "../entity/compuesto_platillo.entity.js";
import ConformaComanda from "../entity/conforma_comanda.entity.js";
import Ingrediente from "../entity/ingrediente.entity.js";

import { sendNotification } from "../services/socket.js"; // Importar función de notificación

// Almacenamiento temporal para rastrear las notificaciones enviadas
const notificacionesEnviadas = new Map();

// Mapa para rastrear si ya se notificó que se alcanzó el límite de 3 notificaciones
const notificacionesOmitidas = new Set();

export async function createPlatilloService(data, userId) {
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);

    try {
        const { nombre_platillo,  ingredientes } = data;

        // Verificar que el usuario existe
        const usuarioExistente = await usuarioRepository.findOneBy({ id_usuario: userId });
        if (!usuarioExistente) {

            return [ null,`El usuario con ID ${userId} no existe.`];
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

        // Verificar disponibilidad de ingredientes después de asignar el precio
        const disponible = precio_platillo > 0 && await verificarDisponibilidadPlatillo(id_platillo);

        platillo.disponible = disponible;
        
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

        // Buscar el platillo por ID
        const platilloItem = await platilloRepository.findOne({
            where: { id_platillo },
            relations: ["creador"],
        });
        // Verificar si el platillo existe
        if (!platilloItem) {
            return [null, `El platillo con ID ${id_platillo} no existe.`];
        }


        // Buscar los ingredientes asociados al platillo
       const ingredientes = await componePlatilloRepository.find({
            where: { id_platillo },
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
        // Estructurar el platillo con sus ingredientes
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

        // Eliminar el platillo
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

//Función para actualizar un platillo por ID
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

        // Actualizar nombre si se proporciona
        if (nombre_platillo !== undefined) platilloFound.nombre_platillo = nombre_platillo;

        // Actualizar disponibilidad si se proporciona
        if (typeof disponible === "boolean") {
        
            const tienePrecio = platilloFound.precio_platillo > 0;
            const tieneIngredientes = await verificarDisponibilidadPlatillo(id_platillo);
            // Validar si se puede marcar como disponible 
            if (disponible && (!tienePrecio || !tieneIngredientes)) {
                return [null, "No se puede marcar como disponible: falta precio o ingredientes suficientes."];
            }
            // Validar si se puede marcar como no disponible
            if (!disponible && tienePrecio && tieneIngredientes) {
                return [null, "No se puede marcar como no disponible: el platillo cumple con todas las condiciones."];
            }
        
            // Actualizar solo si pasa las validaciones
            platilloFound.disponible = disponible;
        }
        
                // Validar y actualizar el usuario asociado si se proporciona un nuevo id_usuario
        if (id_usuario !== undefined) {
            const usuarioFound = await usuarioRepository.findOneBy({ id_usuario });
            if (!usuarioFound) {
                return [null, `El usuario con ID ${id_usuario} no existe.`];
            }
            platilloFound.creador = usuarioFound;
        }

        // Actualizar los ingredientes si se proporcionan
        if (ingredientes && Array.isArray(ingredientes)) {
            await componePlatilloRepository.delete({ id_platillo });
            // Procesar y agregar los ingredientes usando map
            await Promise.all(ingredientes.map(async (ingrediente) => {
                const tipoIngredienteExistente = await tipoIngredienteRepository.findOneBy({
                    id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                });
                // Verificar si el tipo de ingrediente existe
                if (!tipoIngredienteExistente) {
                    throw new Error(`El ingrediente con ID ${ingrediente.id_tipo_ingrediente} no existe.`);
                }
                // Crear la relación entre el platillo y el ingrediente
                await componePlatilloRepository.save({
                    id_platillo,
                    id_tipo_ingrediente: ingrediente.id_tipo_ingrediente,
                    porcion_ingrediente_platillo: ingrediente.porcion_ingrediente_platillo,
                });
            }));

            // Después de actualizar ingredientes, verificar disponibilidad
            const tieneIngredientes = await verificarDisponibilidadPlatillo(id_platillo);
            const tienePrecio = platilloFound.precio_platillo > 0;

            platilloFound.disponible = tienePrecio && tieneIngredientes;
        }
        

        // Guardar el platillo con los cambios
        await platilloRepository.save(platilloFound);
        // Devolver el platillo actualizado
        return [platilloFound, null];
    } catch (error) {
        console.error("Error al actualizar el platillo:", error.message);
        return [null, "Error interno del servidor"];
    }
}

// Función para obtener los tipos de ingredientes filtrados
//Función para filtrar los tipos de ingredientes
export async function getFilteredTipoIngredientesService() {
    const tipoIngredienteRepository = AppDataSource.getRepository(TipoIngrediente);

    try {
        // Consulta con JOIN para incluir la unidad de medida
        const tiposIngredientes = await tipoIngredienteRepository
            .createQueryBuilder("tipoIngrediente")
            .innerJoinAndSelect("tipoIngrediente.unidad_medida", "unidadMedida") // Join con unidad_medida
            .innerJoin("ingrediente", "ingrediente", 
                       "ingrediente.id_tipo_ingrediente = tipoIngrediente.id_tipo_ingrediente")
            .select([
                "tipoIngrediente.id_tipo_ingrediente", 
                "tipoIngrediente.nombre_tipo_ingrediente", 
                "unidadMedida.nombre_unidad_medida" // Selecciona el nombre de la unidad de medida
            ])
            .distinct(true)
            .getMany();

        // Devuelve los tipos de ingredientes con su unidad de medida
        return [tiposIngredientes, null];
    } catch (error) {
        console.error("Error al obtener los tipos de ingredientes filtrados:", error.message);
        return [null, "Error interno del servidor"];
    }
}

// Función para verificar la disponibilidad de ingredientes de un platillo
export async function verificarDisponibilidadPlatillo(id_platillo) {
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);

    try {
        // Buscar los ingredientes asociados al platillo
        const compuestoPlatillo = await componePlatilloRepository.find({
            where: { id_platillo },
            relations: ["tipo_ingrediente"],
        });
        // Verificar si hay ingredientes asociados al platillo
        if (!compuestoPlatillo.length) {
            throw new Error("El platillo no tiene ingredientes asociados o no existe.");
        }

        console.log("Procesando platillo con ID:", id_platillo);
        console.log("Ingredientes asociados:", compuestoPlatillo);
        // Iterar sobre cada tipo de ingrediente del platillo
        for (const compuesto of compuestoPlatillo) {
            console.log("Procesando tipo ingrediente:", compuesto.id_tipo_ingrediente);

            // Buscar todos los ingredientes del mismo tipo en el inventario
            const ingredientes = await ingredienteRepository.find({
                where: { id_tipo_ingrediente: compuesto.id_tipo_ingrediente },
            });
            console.log("Ingredientes del tipo de ingrediente", ingredientes);
            // Verificar si hay ingredientes disponibles
            if (!ingredientes.length) {
                throw new Error(
                    `No hay ingredientes disponibles para el tipo de ingrediente con ID
                     ${compuesto.id_tipo_ingrediente}.`
                );
            }

            // Sumar las cantidades disponibles de todos los ingredientes del mismo tipo
            const cantidadTotalDisponible = ingredientes.reduce(
                (total, ingrediente) => total + ingrediente.cantidad_ingrediente,
                0
            );

            console.log(`Cantidad total disponible: ${cantidadTotalDisponible}`);

            // Verificar si la cantidad total disponible es suficiente
            const porcionRequerida = compuesto.porcion_ingrediente_platillo;

            if (cantidadTotalDisponible < porcionRequerida) {
                console.error(
                    `No hay suficiente cantidad de ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}en el inventario, Requerido: ${porcionRequerida}, Disponible: ${cantidadTotalDisponible}`
                );
                return false;
            }

            console.log(`Ingrediente disponible: ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}`);
        }
        // Todos los ingredientes tienen suficiente cantidad
        return true; 
    } catch (error) {
        console.error("Error al verificar la disponibilidad del platillo:", error.message);
        throw new Error("Error al verificar la disponibilidad del platillo.");
    }
}

  // Función para confirmar un platillo en una comanda
  export async function confirmarPlatilloService(id_platillo, id_comanda, nuevo_estado, io) {
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

    // Obtener instancia de Socket.IO
      const io = getSocketInstance();
 

    // Emitir evento de notificación al cliente
    if (nuevo_estado === "preparado") {
        io.emit("platillo-preparado", {
          id_comanda,
          id_platillo,
          nuevo_estado,
          mensaje: `El platillo con ID ${id_platillo} ahora está en estado "preparado".`,
        });
      }
    
      return [conformaPlatillo, null];
    } catch (error) {
      console.error("Error en confirmarPlatilloService:", error.message);
      throw new Error("Error al confirmar el platillo.");
    }
  }
// Función para descontar ingredientes del inventario
  export async function descontarIngredientesInventario(id_platillo, id_comanda) {
    const componePlatilloRepository = AppDataSource.getRepository(ComponePlatillo);
    const ingredienteRepository = AppDataSource.getRepository(Ingrediente);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const conformaRepository = AppDataSource.getRepository(ConformaComanda);

    try {
        // Buscar relación entre platillo y comanda
        const conformaPlatillo = await conformaRepository.findOne({
            where: { id_comanda, id_platillo },
        });
        // Verificar si la relación existe
        if (!conformaPlatillo) {
            throw new Error("No se encontró la relación entre el platillo y la comanda.");
        }
        // Obtener la cantidad de platillos
        const cantidadPlatillo = conformaPlatillo.cantidad_platillo;
        console.log("Cantidad de platillos:", cantidadPlatillo);

        // Buscar los ingredientes asociados al platillo
        const compuestosPlatillo = await componePlatilloRepository.find({
            where: { id_platillo },
            relations: ["tipo_ingrediente"],
            select: ["id_tipo_ingrediente", "porcion_ingrediente_platillo"],
        });

        console.log("Ingredientes asociados al platillo", compuestosPlatillo);
        // Verificar si hay ingredientes asociados al platillo
        if (!compuestosPlatillo.length) {
            throw new Error("El platillo no tiene ingredientes asociados o no existe.");
        }
        // Lista de seguimiento para los ingredientes descontados
        let cantidadesDescontadas = [];
        // Iterar sobre cada tipo de ingrediente del platillo
        for (const compuesto of compuestosPlatillo) {
            // Obtener todos los ingredientes disponibles del mismo tipo
            const ingredientes = await ingredienteRepository.find({
                where: { id_tipo_ingrediente: compuesto.id_tipo_ingrediente },
                order: { fecha_vencimiento: "ASC" }, // Usar los ingredientes más cercanos a vencerse primero
            });
            // Verificar si hay ingredientes disponibles
            if (!ingredientes.length) {
                throw new Error(`No hay ingredientes disponibles para el tipo ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}.`);
            }
            // Calcular la cantidad total requerida
            const porcionRequeridaTotal = compuesto.porcion_ingrediente_platillo * cantidadPlatillo;
            let cantidadRequerida = porcionRequeridaTotal;
            console.log(`Cantidad requerida para ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}: ${porcionRequeridaTotal}`);

            // Descontar de los ingredientes disponibles
            for (const ingrediente of ingredientes) {
                if (cantidadRequerida <= 0) break;

                const cantidadUsable = Math.min(ingrediente.cantidad_ingrediente, cantidadRequerida);

                // Descontar la cantidad usada
                ingrediente.cantidad_ingrediente -= cantidadUsable;
                cantidadRequerida -= cantidadUsable;

                // Guardar cambios
                await ingredienteRepository.save(ingrediente);

                console.log(`Ingrediente ${ingrediente.id_ingrediente} descontado en ${cantidadUsable}`);
                cantidadesDescontadas.push({ id_ingrediente: ingrediente.id_ingrediente, cantidadUsada: cantidadUsable });
            }
            // Verificar si se descontó la cantidad requerida
            if (cantidadRequerida > 0) {
                throw new Error(`No hay suficiente cantidad de ${compuesto.tipo_ingrediente.nombre_tipo_ingrediente}.`);
            }
        }

        console.log("Ingredientes descontados:", cantidadesDescontadas);

        // Si algún ingrediente quedó en 0, marcar el platillo como no disponible
        const platillo = await platilloRepository.findOneBy({ id_platillo });
        const hayIngredientesAgotados = await ingredienteRepository.count({
            where: { cantidad_ingrediente: 0 },
        });
        // Marcar el platillo como no disponible si hay ingredientes agotados
        if (hayIngredientesAgotados) {
            platillo.disponible = false;
            await platilloRepository.save(platillo);
            console.warn("El platillo ha sido marcado como no disponible por falta de ingredientes.");
        }

        return cantidadesDescontadas;
    } catch (error) {
        console.error("Error al descontar ingredientes:", error.message);
        throw new Error("Ocurrió un error al descontar los ingredientes del inventario.");
    }
}

export async function verificarIngredientesBajoStock() {
    try {
        const ingredienteRepository = AppDataSource.getRepository("ingrediente");

        // Usar QueryBuilder para realizar la comparación con la cantidad de alerta
        const ingredientesBajoStock = await ingredienteRepository
            .createQueryBuilder("ingrediente")
            .innerJoinAndSelect("ingrediente.tipo_ingrediente", "tipoIngrediente")
            .where("ingrediente.cantidad_ingrediente <= tipoIngrediente.cantidad_alerta_tipo_ingrediente")
            .getMany();

        if (ingredientesBajoStock.length > 0) {
            ingredientesBajoStock.forEach((ingrediente) => {
                const idIngrediente = ingrediente.id_ingrediente;

                // Comprobar cuántas veces se ha notificado este ingrediente
                const notificacionesActuales = notificacionesEnviadas.get(idIngrediente) || 0;

                if (notificacionesActuales < 3) {
                    const data = {
                        id_ingrediente: ingrediente.id_ingrediente,
                        tipo_ingrediente: ingrediente.tipo_ingrediente.nombre_tipo_ingrediente,
                        cantidad_actual: ingrediente.cantidad_ingrediente,
                        cantidad_alerta: ingrediente.tipo_ingrediente.cantidad_alerta_tipo_ingrediente,
                    };

                    console.log("Notificando ingrediente bajo stock:", data);

                    // Emitir un evento WebSocket
                    sendNotification("ingrediente-bajo-stock", data);

                    // Actualizar el contador de notificaciones
                    notificacionesEnviadas.set(idIngrediente, notificacionesActuales + 1);

                    // Eliminar del mapa de omitidos si se vuelve a notificar
                    notificacionesOmitidas.delete(idIngrediente);
                } else {
                    // Evitar mensajes repetitivos para ingredientes ya notificados como omitidos
                    if (!notificacionesOmitidas.has(idIngrediente)) {
                        console.log(
                            `Notificación omitida para ingrediente ${idIngrediente}, ya se enviaron 3 veces.`
                        );
                        notificacionesOmitidas.add(idIngrediente);
                    }
                }
            });
        } else {
            console.log("No hay ingredientes en bajo stock actualmente.");
        }
    } catch (error) {
        console.error("Error verificando ingredientes bajo stock:", error.message);
    }
}