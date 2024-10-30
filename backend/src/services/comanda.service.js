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
  if ( usuario.rol_usuario !== 'mesero') {
    throw new Error('Solo el rol "mesero" tiene permiso para crear comandas.');
  }
    

  // Crear la comanda asignando el objeto de usuario
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,  // Asignar el objeto completo de usuario
    estado_comanda: data.estado || 'pendiente',
    fecha_compra_comanda: data.fecha_compra_comanda || null,
    hora_compra_comanda: data.hora_compra_comanda || null
  });
  await comandaRepository.save(nuevaComanda);

  return nuevaComanda;
}


export async function getAllComandas() {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return await comandaRepository.find({ relations: ['usuario'] }); // Obtener todas las comandas con la relación usuario
}




export async function getComandaById(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'], // Incluye la relación con usuario
  });
}
export async function getAllComandas() {
  try {
    const comandaRepository = AppDataSource.getRepository(Comanda);
    const comandasEncontradas = comandaRepository.find();
    if (!comandasEncontradas || comandasEncontradas.length === 0) {
        return [null, "No hay comandas"];
    } 
  }catch(error) {
    console.error("Error al obtener a los usuarios", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateComanda(comandaId, data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id_comanda: comandaId }, relations: ['usuario'] });

  if (!comanda) {
    throw new Error('Comanda no encontrada.');
  }

  // Verificar que el estado actual permita modificación
  if (comanda.estado_comanda !== 'pendiente') {
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
    estado_comanda: data.estado_comanda || comanda.estado_comanda,
    fecha_compra_comanda: data.fecha_compra_comanda || comanda.fecha_compra_comanda,
    hora_compra_comanda: data.hora_compra_comanda || comanda.hora_compra_comanda,
  });

  await comandaRepository.save(comanda);
  return comanda;
}


export async function deleteComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id_comanda: comandaId }, relations: ['usuario'] });
  if (comanda) {
    await comandaRepository.remove(comanda);
    return comanda;
  }
  throw new Error('Comanda no encontrada.');
}

export async function completeComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });

  if (comanda && comanda.estado_comanda === 'pendiente') {
    comanda.estado_comanda = 'completada';
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede completar.');
}
