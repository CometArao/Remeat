// backend/src/services/comanda.service.js
import Comanda from '../entity/comanda.entity.js';
import Usuario from '../entity/usuario.entity.js';
import { AppDataSource } from '../config/configDb.js';

export async function createComanda(meseroId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Obtener el objeto usuario correspondiente al meseroId
  const usuario = await usuarioRepository.findOne({ where: { id_usuario: meseroId } });
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  // Crear la comanda asignando el objeto de usuario
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,  // Asignar el objeto completo de usuario
    estado: 'pendiente'
  });
  await comandaRepository.save(nuevaComanda);

  return nuevaComanda;
}

export async function getComandasByMesero(meseroId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return comandaRepository.find({ where: { usuario: { id_usuario: meseroId } } }); // Buscar por usuario
}

export async function updateComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });

  if (comanda.estado === 'pendiente') {
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede modificar si ya está cocinada.');
}

export async function deleteComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });
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
