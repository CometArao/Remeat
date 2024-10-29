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

export async function updateComanda(comandaId, data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id_comanda: comandaId }, relations: ['usuario'] });

  if (comanda && comanda.estado === 'pendiente') {
    Object.assign(comanda, data);
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede modificar si ya está cocinada o no se encuentra.');
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

  if (comanda && comanda.estado === 'pendiente') {
    comanda.estado = 'completada';
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede completar.');
}
