// backend/src/services/comanda.service.js
import Comanda from '../entity/comanda.entity.js';
import Usuario from '../entity/usuario.entity.js';
import { AppDataSource } from '../config/configDb.js';

export async function createComanda(data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Obtener el objeto usuario correspondiente al meseroId
  const usuario = await usuarioRepository.findOne({ where: { id_usuario: data.id_usuario } });
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

   // Validar que el usuario tenga `id_usuario: 2` y `rol_usuario: mesero`
   if (usuario.id_usuario !== 2 || usuario.rol_usuario !== 'mesero') {
    throw new Error('Solo el usuario con ID 2 y rol "mesero" tiene permiso para crear comandas.');
  }

  // Crear la comanda asignando el objeto de usuario
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,  // Asignar el objeto completo de usuario
    estado: data.estado || 'pendiente',
    fecha_compra_comanda: data.fecha_compra_comanda || null,
    hora_compra_comanda: data.hora_compra_comanda || null
  });
  await comandaRepository.save(nuevaComanda);

  return nuevaComanda;
}


export async function getAllComandas() {
}
"use strict";
import { AppDataSource } from "../config/configDb.js";
import Comanda from "../entity/comanda.entity.js";
import Platillo from "../entity/platillo.entity.js";
import ConformaComanda from "../entity/conforma_comanda.entity.js";

export async function createComandaService(data) {
    const comandaRepository = AppDataSource.getRepository(Comanda);
    const platilloRepository = AppDataSource.getRepository(Platillo);
    const conformaComandaRepository = AppDataSource.getRepository(ConformaComanda);

    try {
        const { fecha_compra_comanda, hora_compra_comanda, estado_comanda, id_usuario, platillos } = data;

        // Crear la comanda
        const newComanda = comandaRepository.create({
            fecha_compra_comanda,
            hora_compra_comanda,
            estado_comanda,
            id_usuario
        });
        await comandaRepository.save(newComanda);

        // Agregar los platillos a la comanda
        if (platillos && platillos.length > 0) {
            const platillosToAdd = platillos.map(platillo => {
                return conformaComandaRepository.create({
                    id_comanda: newComanda.id_comanda,
                    id_platillo: platillo.id_platillo,
                    estado_platillo: platillo.estado_platillo
                });
            });

            await conformaComandaRepository.save(platillosToAdd);
        }

        return [newComanda, null];
    } catch (error) {
        console.error("Error al crear la comanda:", error);
        return [null, error.message];
    }
}


export async function getComandasByMeseroService(meseroId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return await comandaRepository.find({ relations: ['usuario'] }); // Obtener todas las comandas con la relación usuario
}

export async function updateComandaService(comandaId, platillos) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });
}


export async function getComandaById(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'], // Incluye la relación con usuario
  });
}

export async function updateComanda(comandaId, data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id_comanda: comandaId }, relations: ['usuario'] });

  if (!comanda) {
    throw new Error('Comanda no encontrada.');
  }

  // Verificar que el estado actual permita modificación
  if (comanda.estado !== 'pendiente') {
    throw new Error('La comanda no se puede modificar porque ya está completada o en otro estado.');
  }

  // Validar que no se intente cambiar el id_usuario
  if (data.id_usuario && data.id_usuario !== comanda.usuario.id_usuario) {
    throw new Error('No se permite cambiar el ID del usuario asociado a la comanda.');
  }

  // Validar que no se intente cambiar el id_comanda
  if (data.id_comanda && data.id_comanda !== comandaId) {
    throw new Error('No se permite cambiar el ID de la comanda.');
  }

  // Actualizar solo los campos permitidos
  Object.assign(comanda, {
    estado: data.estado || comanda.estado,
    fecha_compra_comanda: data.fecha_compra_comanda || comanda.fecha_compra_comanda,
    hora_compra_comanda: data.hora_compra_comanda || comanda.hora_compra_comanda,
  });

  await comandaRepository.save(comanda);
  return comanda;
}


export async function deleteComanda(comandaId) {

}


export async function deleteComandaService(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id_comanda: comandaId }, relations: ['usuario'] });
  if (comanda) {
    await comandaRepository.remove(comanda);
    return comanda;
  }
  throw new Error('Comanda no encontrada.');
}




export async function completeComandaService(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });

  if (comanda && comanda.estado === 'pendiente') {
    comanda.estado = 'completada';
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede completar.');
}



