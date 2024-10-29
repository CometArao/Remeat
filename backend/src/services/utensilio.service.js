"use strict";
import Utensilio from "../entity/utensilio.entity.js";
import TipoUtensilio from "../entity/tipo_utensilio.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import utensilio from "../entity/utensilio.entity.js";
import tipo_utensilio from "../entity/tipo_utensilio.entity.js";

export async function createUtensilioService(utensilio) {
    try {
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    const { cantidad_utensilio, id_tipo_utensilio } = utensilio;

    //declara una funcion con dos parametros que devuelve un diccionario(hashset) con esos dos parametros
    const createErrorMessage = (dataInfo, message) => ({
        dataInfo,
        message
    });
    //verificar si existe el tipo
    const existeTipo = await tipoUtensilioRepository.findOne({
        where: {
            id_tipo_utensilio: id_tipo_utensilio
        },
    });
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    if(!existeTipo) {
        return [null, createErrorMessage("tipo_utensilio", "el tipo utensilio no existe")]
    }
    const nuevoUtensilio = utensilioRepository.create({
        cantidad_utensilio: cantidad_utensilio,
        id_tipo_utensilio: id_tipo_utensilio
    })
    console.log(nuevoUtensilio)
    await utensilioRepository.save(nuevoUtensilio);
    console.log(nuevoUtensilio)
    return [nuevoUtensilio, null];
    }catch(error) {
        console.error("Error al crear un utensilio", error)
        return [null, "Error interno del servidor"];
    }
}

export async function getUtensilioService(query) {
  try {
    const {id_utensilio} = query
    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    const utensilioEncontrado = await utensilioRepository.findOne({
        where: [{id_utensilio: id_utensilio}]
    });

    if (!utensilioEncontrado) {
        return [null, "Utensilio no encontrado"];
    } 
    return utensilioEncontrado;
  }catch (error) {
    console.error("Error obtener el utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUtensiliosService() {
  try {
    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    const utensilios = await utensilioRepository.find();

    if (!utensilios || utensilios.length === 0) {
        return [null, "No hay utensilios"];
    } 
    return [utensilios, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUtensilioService(query, body) {
  try {
    const createErrorMessage = (dataInfo, message) => ({
        dataInfo,
        message
    });
    const { id_utensilio } = query;
    const { id_tipo_utensilio, cantidad_utensilio } = body

    const utensilioRepository = AppDataSource.getRepository(Utensilio);
    const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);

    const existeTipo = await tipoUtensilioRepository.findOne({
        where: {
            id_tipo_utensilio: id_tipo_utensilio
        },
    });
    console.log(existeTipo)
    if(!existeTipo) {
        return [null, createErrorMessage("tipo_utensilio", "el tipo utensilio no existe")]
    }
    const utensilioFound = await utensilioRepository.findOne({
      where: [{ id_utensilio: id_utensilio }],
    });

    if (!utensilioFound) {
        return [null, "Usuario no encontrado"];
    } 
    const existingTipo_utensilio = await utensilioRepository.findOne({
        where: [{id_tipo_utensilio: body.id_tipo_utensilio}]
    })
    if(!existingTipo_utensilio) {
        return [null, "tipo_utensilio no encontrado"]
    }
    const dataUpdateUtensilio = {
      cantidad_utensilio: body.cantidad_utensilio,
      id_tipo_utensilio: body.id_tipo_utensilio,
    };
    //console.log(dataUpdateUtensilio)

    await utensilioRepository.update({ id_utensilio: utensilioFound.id_utensilio }, dataUpdateUtensilio);


    //comprobar
    const utensilioDatos = await utensilioRepository.findOne({
      where: { id_utensilio: utensilioFound.id_utensilio },
    });
    if (!utensilioDatos) {
      return [null, "Utensilio no encontrado después de actualizar"];
    }
    return [utensilioDatos, null];
  } catch (error) {
    console.error("Error al modificar un utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUtensilioService(query) {
  try {
    const { id_utensilio } = query;

    const utensilioRepository = AppDataSource.getRepository(Utensilio);

    const UtensilioFound = await utensilioRepository.findOne({
      where: [{ id_utensilio: id_utensilio }],
    });

    if (!UtensilioFound) return [null, "Utensilio no encontrado"];

    //TODO agregar permisos a estos servicios
    //if (userFound.rol === "administrador") {
      //return [null, "No se puede eliminar un usuario con rol de administrador"];
    //}

    const UtensilioEliminado = await utensilioRepository.remove(UtensilioFound);
    return [UtensilioEliminado, null];
  } catch (error) {
    console.error("Error al eliminar un utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}