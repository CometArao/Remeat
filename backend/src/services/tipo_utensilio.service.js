"use strict";
import TipoUtensilio from "../entity/tipo_utensilio.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createTipoUtensilioService(tipoUtensilio) {
    try {
        const tipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
        const { nombre_tipo_utensilio } = tipoUtensilio;

        //declara una funcion con dos parametros que devuelve un diccionario(hashset) con esos dos parametros
        const createErrorMessage = (dataInfo, message) => ({
            dataInfo,
            message
        });

        //que el nombre solo se le agregue nombre con todo en minuscula sin tilde ni numeros
        const existeTipoUtensilioNombre = await tipoUtensilioRepository.findOne({
            where: {
                nombre_tipo_utensilio
            }
        })
        if(existeTipoUtensilioNombre) {
            return [null, createErrorMessage("nombre_tipo_utensilio", "Ese nombre ya existe")]
        }
        const nuevoTipoUtensilio = tipoUtensilioRepository.create({
            nombre_tipo_utensilio: nombre_tipo_utensilio
        })
        await tipoUtensilioRepository.save(nuevoTipoUtensilio);
        return [nuevoTipoUtensilio, null];
    }catch(error) {
        console.error("Error al crear un utensilio", error)
    }
}
export async function getTipoUtensilioService(query) {
  try {
    const {id_tipo_utensilio} = query
    const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    console.log(id_tipo_utensilio)
    const tipoUtensilioEncontrado = await tipo_utensilioRepository.findOne({
        where: [{id_tipo_utensilio: id_tipo_utensilio}]
    });

    if (!tipoUtensilioEncontrado) {
        return [null, "Utensilio no encontrado"];
    } 
    return tipoUtensilioEncontrado;
  }catch (error) {
    console.error("Error obtener el utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function getTiposUtensilioService() {
  try {
    const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    const utensiliosEncontrado = await tipo_utensilioRepository.find({

    });
    console.log("utensiliosEncontrado")
    console.log(utensiliosEncontrado)

    if (!utensiliosEncontrado) {
        return [null, "Utensilio no encontrado"];
    } 
    return [utensiliosEncontrado, null];
  }catch (error) {
    console.error("Error obtener el utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function updateTipoUtensilioService(query) {
  try {
    const {id_tipo_utensilio} = query
    const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    const tipo_utensilioEncontrado = await tipo_utensilioRepository.findOne({
        where: [{id_tipo_utensilio: id_tipo_utensilio}]
    });

    const dataUpdateTipoUtensilio = {
      nombre_tipo_utensilio: query.nombre_tipo_utensilio
    };
    await tipo_utensilioRepository.update({ id_tipo_utensilio: tipo_utensilioEncontrado.id_tipo_utensilio }, dataUpdateTipoUtensilio);

    const tipo_utensilioNuevo = await tipo_utensilioRepository.findOne({
        where: [{id_tipo_utensilio: id_tipo_utensilio}]
    });

    if (!tipo_utensilioNuevo) {
        return [null, "Utensilio no encontrado"];
    } 
    return [tipo_utensilioNuevo, null];
  }catch (error) {
    console.error("Error obtener el utensilio:", error);
    return [null, "Error interno del servidor"];
  }
}
export async function deleteTiposUtensiliosService(query) {
  try {
    const { id_tipo_utensilio } = query;
    const TipoUtensilioRepository = AppDataSource.getRepository(TipoUtensilio);
    const tipoUtensilioEncontrado = await TipoUtensilioRepository.findOne({
      where: [{ id_tipo_utensilio: id_tipo_utensilio }],
    });

    if (!tipoUtensilioEncontrado) return [null, "Tipo Utensilio no encontrado"];

    const tipoUtensilioBorrado = await TipoUtensilioRepository.remove(tipoUtensilioEncontrado);

    return [tipoUtensilioBorrado, null];
  } catch (error) {
    console.error("Error al eliminar un tipo utensilio:", error);
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
    const { id_utensilio } = query;

    const utensilioRepository = AppDataSource.getRepository(Utensilio);



    if (!tipo_utensilioFound) {
        return [null, "Usuario no encontrado"];
    } 
    //No se nesesita validar esto porque solo la id es unica
    //Quizas el nombre deberia ser unico ¿TODO:?
    //const existingUser = await userRepository.findOne({
      //where: [{ rut: body.rut }, { email: body.email }],
    //});

    //if (existingUser && existingUser.id !== userFound.id) {
      //return [null, "Ya existe un usuario con el mismo rut o email"];
    //}

    //if (body.password) {
      //const matchPassword = await comparePassword(
        //body.password,
        //userFound.password,
      //);

      //if (!matchPassword) return [null, "La contraseña no coincide"];
    //}
    const existingTipo_utensilio = await utensilioRepository({
        where: [{id_tipo_utensilio: body.id_tipo_utensilio}]
    })
    if(!existingTipo_utensilio) {
        return [null, "tipo_utensilio no encontrado"]
    }

    const dataUpdateUtensilio = {
      cantidad_tipo_utensilio: body.cantidad_tipo_utensilio,
      id_tipo_utensilio: body.id_tipo_utensilio,
    };


    await utensilioRepository.update({ id_utensilio: tipo_utensilioFound.id_utensilio }, dataUpdateUtensilio);


    //comprobar
    const utensilioDatos = await userRepository.findOne({
      where: { id_utensilio: tipo_utensilioFound.id_utensilio },
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

    if (!UtensilioFound) return [null, "Usuario no encontrado"];

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