// backend/src/services/comanda.service.js
import Comanda from '../entity/comanda.entity.js';
import Usuario from '../entity/usuario.entity.js';
import Platillo from '../entity/platillo.entity.js';
import ConformaComanda from '../entity/conforma_comanda.entity.js';
import HorarioLaboral from '../entity/horario_laboral.entity.js';
import { AppDataSource } from '../config/configDb.js';
import { format } from 'date-fns';

/*
async function verificarHorarioLaboral(idUsuario) {
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Obtener el usuario junto con su horario laboral y los días del horario
  const usuario = await usuarioRepository.findOne({
    where: { id_usuario: idUsuario },
    relations: ['horario_laboral', 'horario_laboral.horario_dia'] // Correcto uso de la relación horario_dia
  });

  console.log("Usuario obtenido:", usuario); // Depuración para verificar datos del usuario

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  if (!usuario.horario_laboral) {
    throw new Error("El usuario no tiene un horario laboral asignado.");
  }

  // Obtener el día actual de la semana y la hora actual
  const diaSemana = new Date().toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
  const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });

  console.log(`Verificando horario para el día: ${diaSemana}, Hora actual: ${horaActual}`); // Depuración de fecha y hora

  // Buscar el horario del día correspondiente dentro del horario laboral del usuario
  const horarioDia = usuario.horario_laboral.horario_dia.find(horario => horario.dia_semana === diaSemana);

  if (!horarioDia) {
    throw new Error("No hay un horario laboral configurado para este día.");
  }

  // Verificar si la hora actual está dentro del rango de inicio y fin de horario laboral
  console.log(`Horario para ${diaSemana}: ${horarioDia.hora_inicio} - ${horarioDia.hora_fin}`); // Depuración de horario
  if (horaActual >= horarioDia.hora_inicio && horaActual <= horarioDia.hora_fin) {
    return true;
  }

  throw new Error("El usuario no está en su horario laboral.");
}
*/



export async function obtenerComandasConPlatillos() {
  const comandaRepository = AppDataSource.getRepository(Comanda);

  const comandas = await comandaRepository
    .createQueryBuilder('comanda')
    .leftJoinAndSelect(ConformaComanda, 'conforma', 'conforma.id_comanda = comanda.id_comanda')
    .leftJoinAndSelect('comanda.usuario', 'usuario') // Incluimos la relación del usuario
    .leftJoinAndSelect(Platillo, 'platillo', 'conforma.id_platillo = platillo.id_platillo') // Agregar la relación con platillo
    .select([
      'comanda.id_comanda', 
      'comanda.fecha_compra_comanda', 
      'conforma.id_platillo', 
      'conforma.cantidad_platillo', // Incluir la cantidad del platillo
      'usuario.id_usuario', 
      'platillo.nombre_platillo'
    ])
    .getRawMany();

  const comandasEnHorario = [];

  for (const comanda of comandas) {
    try {
      // Verifica el horario laboral del usuario asignado a la comanda
      //await verificarHorarioLaboral(comanda.usuario_id_usuario);
      comandasEnHorario.push({
        idComanda: comanda.comanda_id_comanda,
        fecha: format(new Date(comanda.comanda_fecha_compra_comanda), 'yyyy-MM-dd'), // Formato legible de fecha
        tienePlatillos: comanda.conforma_id_platillo !== null,
        cantidad: comanda.conforma_cantidad_platillo, // Agregar cantidad del platillo
        nombrePlatillo: comanda.platillo_nombre_platillo,
        idPlatillo: comanda.conforma_id_platillo
      });
    } catch (error) {
      console.log(`Comanda ${comanda.id_comanda} omitida: ${error.message}`);
    }
  }

  return {
    status: "Success",
    message: "Comandas obtenidas con estado de platillos",
    data: comandasEnHorario
  };
}




export async function addPlatilloToComanda(comandaId, platilloData) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const platilloRepository = AppDataSource.getRepository(Platillo);
  const conformaRepository = AppDataSource.getRepository(ConformaComanda);

  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'] // Relación con usuario para obtener su ID
  });
  if (!comanda) throw new Error('Comanda no encontrada.');

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  const platillo = await platilloRepository.findOne({ where: { id_platillo: platilloData.id_platillo } });
  if (!platillo) throw new Error('Platillo no encontrado.');

  const newConforma = conformaRepository.create({
    comanda: comanda,
    platillo: platillo,
    estado_platillo: platilloData.estado || 'pendiente',
    cantidad_platillo: platilloData.cantidad || 1 // Default a 1 si no se especifica cantidad
  });

  await conformaRepository.save(newConforma);
  return newConforma;
}





// Función para crear una comanda
export async function createComanda(data) {
  //await verificarHorarioLaboral(data.id_usuario);
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  const usuario = await usuarioRepository.findOne({ where: { id_usuario: data.id_usuario } });
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  if (usuario.rol_usuario !== 'mesero') {
    throw new Error('Solo el rol "mesero" tiene permiso para crear comandas.');
  }

  const nuevaComanda = comandaRepository.create({
    usuario: usuario,
    estado_comanda: data.estado || 'pendiente',
    fecha_compra_comanda: data.fecha_compra_comanda || null,
    hora_compra_comanda: data.hora_compra_comanda || null
  });
  await comandaRepository.save(nuevaComanda);

  return nuevaComanda;
}


export async function getAllComandas() {
  const comandaRepository = AppDataSource.getRepository(Comanda);

  // Obtener todas las comandas con la relación del usuario
  const comandas = await comandaRepository.find({ relations: ['usuario'] });

  // Filtrar las comandas según el horario laboral de cada usuario asociado
  const comandasEnHorario = [];

  for (const comanda of comandas) {
    try {
      // Verificar el horario laboral del usuario asociado a la comanda
      //await verificarHorarioLaboral(comanda.usuario.id_usuario);
      // Si el usuario está en horario laboral, agregar la comanda a la lista
      comandasEnHorario.push(comanda);
    } catch (error) {
      // Omitir esta comanda si el usuario no está en horario laboral
      // No se necesita imprimir el mensaje en la consola
    }
  }

  // Verificar si hay comandas dentro del horario laboral
  if (comandasEnHorario.length === 0) {
    return {
      status: "Success",
      message: "No se encontraron comandas dentro del horario laboral permitido",
      data: []
    };
  }

  return {
    status: "Success",
    message: "Comandas obtenidas dentro del horario laboral",
    data: comandasEnHorario
  };
}


export async function getComandaById(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'] // Relación con usuario
  });

  if (!comanda) throw new Error('Comanda no encontrada.');

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  return comanda;
}


export async function updateComanda(comandaId, data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'] // Relación con usuario
  });

  if (!comanda) throw new Error('Comanda no encontrada.');

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  if (comanda.estado_comanda !== 'pendiente') {
    throw new Error('La comanda no se puede modificar porque ya está completada o en otro estado.');
  }

  if (data.id_usuario && data.id_usuario !== comanda.usuario.id_usuario) {
    throw new Error('No se permite cambiar el ID del usuario asociado a la comanda.');
  }

  if (data.id_comanda && data.id_comanda !== comandaId) {
    throw new Error('No se permite cambiar el ID de la comanda.');
  }

  Object.assign(comanda, {
    estado_comanda: data.estado_comanda || comanda.estado_comanda,
    fecha_compra_comanda: data.fecha_compra_comanda || comanda.fecha_compra_comanda,
    hora_compra_comanda: data.hora_compra_comanda || comanda.hora_compra_comanda,
  });

  await comandaRepository.save(comanda);
  return comanda;
}


export async function deleteComanda(comandaId) {
  const conformaRepository = AppDataSource.getRepository(ConformaComanda);
  const comandaRepository = AppDataSource.getRepository(Comanda);

  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'] // Relación con usuario
  });
  
  if (!comanda) throw new Error('Comanda no encontrada.');

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  await conformaRepository.delete({ id_comanda: comandaId });
  await comandaRepository.remove(comanda);
  
  return comanda;
}

export async function completeComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario'] // Relación con usuario
  });

  if (!comanda) throw new Error('Comanda no encontrada.');

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  if (comanda.estado_comanda === 'pendiente') {
    comanda.estado_comanda = 'completada';
    await comandaRepository.save(comanda);
    return comanda;
  }
  
  throw new Error('La comanda no se puede completar.');
}
