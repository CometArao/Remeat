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
  return comandaRepository.find({ where: { mesero: meseroId }, relations: ['platillos'] });
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

export async function updateComandaService(comandaId, platillos) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });

  if (comanda.estado === 'pendiente') {
    comanda.platillos = platillos;
    await comandaRepository.save(comanda);
    return comanda;
  }
  throw new Error('La comanda no se puede modificar si ya está cocinada.');
}

export async function deleteComandaService(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({ where: { id: comandaId } });
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
