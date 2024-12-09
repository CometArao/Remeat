// backend/src/services/comanda.service.js
import Comanda from '../entity/comanda.entity.js';
import Usuario from '../entity/usuario.entity.js';
import Platillo from '../entity/platillo.entity.js';
import ConformaComanda from '../entity/conforma_comanda.entity.js';
import HorarioLaboral from '../entity/horario_laboral.entity.js';
import { AppDataSource } from '../config/configDb.js';
import { format } from 'date-fns';
import Menu from '../entity/menu.entity.js';



/* async function verificarHorarioLaboral(idUsuario) {
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Obtener el usuario junto con su horario laboral y los días del horario
  const usuario = await usuarioRepository.findOne({
    where: { id_usuario: idUsuario },
    relations: ['horario_laboral', 'horario_laboral.horario_dia'] // Correcto uso de la relación horario_dia
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  if (!usuario.horario_laboral) {
    throw new Error("El usuario no tiene un horario laboral asignado.");
  }

  // Obtener el día actual de la semana y la hora actual
  const diaSemana = new Date().toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
  const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });


  // Buscar el horario del día correspondiente dentro del horario laboral del usuario
  const horarioDia = usuario.horario_laboral.horario_dia.find(horario => horario.dia_semana === diaSemana);

  if (!horarioDia) {
    throw new Error("No hay un horario laboral configurado para este día.");
  }

  // Verificar si la hora actual está dentro del rango de inicio y fin de horario laboral
  if (horaActual >= horarioDia.hora_inicio && horaActual <= horarioDia.hora_fin) {
    return true;
  }

  throw new Error("El usuario no está en su horario laboral.");
}
*/

export async function getMeserosService(){
  // Obtén el repositorio de la entidad Usuario
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  try {
    // Usa find con un filtro para obtener solo los usuarios con rol 'mesero'
    const meseros = await usuarioRepository.find({
      where: { rol_usuario: 'mesero' },
      select: ['id_usuario', 'nombre_usuario', 'apellido_usuario', 'correo_usuario'], // Solo los campos necesarios
    });

    return meseros; // Devuelve la lista de meseros
  } catch (error) {
    // Captura cualquier error y lánzalo con un mensaje claro
    throw new Error('Error al obtener los meseros: ' + error.message);
  }
};


export async function getPlatillosDelDiaService(){
  const menuRepository = AppDataSource.getRepository(Menu);

  try {
    // Busca el menú del día con la relación correcta
    const menuDelDia = await menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.platillo', 'platillo') // Cambiado de 'platillos' a 'platillo'
      .where('menu.disponibilidad = :disponible', { disponible: true })
      .orderBy('menu.fecha', 'DESC') // Busca el menú más reciente en caso de múltiples menús disponibles
      .getOne();

    if (!menuDelDia) {
      throw new Error('No se encontró un menú disponible para el día actual.');
    }

    return menuDelDia.platillo; // Devuelve la lista de platillos del menú del día
  } catch (error) {
    throw new Error('Error al obtener los platillos del menú del día: ' + error.message);
  }
};






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
      'conforma.estado_platillo',   // Incluir el estado del platillo
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
        idPlatillo: comanda.conforma_id_platillo,
        estadoPlatillo: comanda.conforma_estado_platillo // Agregar estado del platillo
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
  const menuRepository = AppDataSource.getRepository(Menu);

  // Verificar si la comanda existe
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario']
  });
  if (!comanda) throw new Error('Comanda no encontrada.');

   // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  // Verificar si el platillo existe
  const platillo = await platilloRepository.findOne({
    where: { id_platillo: platilloData.id_platillo }
  });
  if (!platillo) throw new Error('Platillo no encontrado.');

  // Verificar si el platillo está en un menú activo
  const menu = await menuRepository.findOne({
    where: { id_menu: platilloData.menuIdMenu, disponibilidad: true },
    relations: ['platillo'] // Carga los platillos del menú
  });

  if (!menu || !menu.platillo.some(p => p.id_platillo === platilloData.id_platillo)) {
    throw new Error('El platillo no está en el menú activo.');
  }

  // Crear la relación en ConformaComanda
  const newConforma = conformaRepository.create({
    comanda: comanda,
    platillo: platillo,
    estado_platillo: platilloData.estado || 'pendiente',
    cantidad_platillo: platilloData.cantidad || 1
  });

  // Guardar la relación en la base de datos
  await conformaRepository.save(newConforma);

  return newConforma;
}




export async function createComanda(data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Buscar al usuario únicamente por correo
  const usuario = await usuarioRepository.findOne({
    where: { correo_usuario: data.email }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado con el correo proporcionado.');
  }

  // Validar que el rol sea "mesero"
  if (usuario.rol_usuario !== 'mesero') {
    throw new Error('Solo el rol "mesero" tiene permiso para crear comandas.');
  }

  // Crear la comanda
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,
    estado_comanda: data.estado_comanda || 'pendiente',
    fecha_compra_comanda: data.fecha_compra_comanda || null,
    hora_compra_comanda: data.hora_compra_comanda || null,
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

  // Buscar la comanda por ID
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario']
  });

  if (!comanda) {
    throw new Error('Comanda no encontrada.');
  }

  // Verificar el horario laboral del usuario
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  // Validar que el estado sea 'pendiente'
  if (comanda.estado_comanda !== 'pendiente') {
    throw new Error(`La comanda no se puede completar porque está en estado '${comanda.estado_comanda}'.`);
  }

  // Cambiar el estado de la comanda directamente
  const result = await comandaRepository.update(comandaId, { estado_comanda: 'completada' });

  if (result.affected === 0) {
    throw new Error('Error al actualizar el estado de la comanda.');
  }

  // Retornar la comanda actualizada
  const updatedComanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ['usuario']
  });

  return updatedComanda;
}



