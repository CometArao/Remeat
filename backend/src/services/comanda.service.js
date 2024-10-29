// backend/src/services/comanda.service.js
import Comanda from '../entity/comanda.entity.js';
import { AppDataSource } from '../config/configDb.js';

export async function createComanda(meseroId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const nuevaComanda = comandaRepository.create({
    mesero: meseroId,
    estado: 'pendiente'
  });
  await comandaRepository.save(nuevaComanda);

  // Lógica de notificación al cocinero (si usas WebSockets o similar)
  return nuevaComanda;
}

export async function getComandasByMesero(meseroId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  return comandaRepository.find({ where: { mesero: meseroId } });
}

export async function updateComanda(comandaId, platillos) {
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
