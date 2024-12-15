// backend/src/services/comanda.service.js
import Comanda from "../entity/comanda.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Platillo from "../entity/platillo.entity.js";
import ConformaComanda from "../entity/conforma_comanda.entity.js";
import HorarioLaboral from "../entity/horario_laboral.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { format } from "date-fns";


import Menu from "../entity/menu.entity.js";




async function verificarHorarioLaboral(idUsuario) {
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Obtener el usuario con su horario laboral y los días del horario
  const usuario = await usuarioRepository.findOne({
    where: { id_usuario: idUsuario },
    relations: ["horario_laboral", "horario_laboral.horario_dia"], // Relaciones necesarias
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  if (!usuario.horario_laboral) {
    throw new Error("El usuario no tiene un horario laboral asignado.");
  }

  // Función para normalizar textos (eliminar tildes)
  const normalizarTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos
  };

  // Obtener la fecha actual en UTC
  const fechaActual = new Date(Date.now());
  console.log("Hora original del servidor (UTC):", fechaActual.toISOString());

  // Restar manualmente 3 horas para reflejar el desfase horario
  fechaActual.setUTCHours(fechaActual.getUTCHours() - 3);

  // Formatear la hora ajustada (-3 horas) en formato HH:mm:ss
  const horaAjustadaISO = fechaActual.toISOString(); // Formato ISO ajustado
  const horaAjustada = horaAjustadaISO.split("T")[1].split(".")[0]; // Extrae HH:mm:ss
  console.log("Hora ajustada manualmente (-3 horas):", horaAjustada);

  // Obtener el día de la semana en UTC después del ajuste de -3 horas
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const diaSemanaAjustado = diasSemana[fechaActual.getUTCDay()]; // Día ajustado
  const diaNormalizado = normalizarTexto(diaSemanaAjustado); // Normalizar para evitar problemas con tildes
  console.log("Día de la semana (ajustado y normalizado):", diaNormalizado);

  // Buscar el horario del día correspondiente dentro del horario laboral del usuario
  const horarioDia = usuario.horario_laboral.horario_dia.find(
    (horario) => normalizarTexto(horario.dia_semana) === diaNormalizado
  );

  if (!horarioDia) {
    throw new Error(`No hay horario laboral configurado para el día: ${diaSemanaAjustado}.`);
  }

  console.log("Horario laboral del día encontrado:", horarioDia);

  // Verificar si la hora ajustada está dentro del rango de inicio y fin del horario laboral
  if (horaAjustada >= horarioDia.hora_inicio && horaAjustada <= horarioDia.hora_fin) {
    console.log("El usuario está dentro del horario laboral.");
    return true; // Está dentro del horario laboral
  }

  console.log(
    `El usuario está fuera del horario laboral (${horaAjustada} fuera de ${horarioDia.hora_inicio} - ${horarioDia.hora_fin}).`
  );
  throw new Error(
    `El usuario no está en su horario laboral (${horaAjustada} fuera de ${horarioDia.hora_inicio} - ${horarioDia.hora_fin}).`
  );
}








export async function getMeserosService(){
  // Obtén el repositorio de la entidad Usuario
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  try {
    // Usa find con un filtro para obtener solo los usuarios con rol "mesero"
    const meseros = await usuarioRepository.find({
      where: { rol_usuario: "mesero" },
      select: ["id_usuario", "nombre_usuario", "apellido_usuario", "correo_usuario"], // Solo los campos necesarios
    });

    return meseros; // Devuelve la lista de meseros
  } catch (error) {
    // Captura cualquier error y lánzalo con un mensaje claro
    throw new Error("Error al obtener los meseros: " + error.message);
  }
};


export async function getPlatillosDelDiaService(){
  const menuRepository = AppDataSource.getRepository(Menu);

  try {
    // Busca el menú del día con la relación correcta
    const menuDelDia = await menuRepository
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.platillo", "platillo") 
      .where("menu.disponibilidad = :disponible", { disponible: true })
      .orderBy("menu.fecha", "DESC") // Busca el menú más reciente en caso de múltiples menús disponibles
      .getOne();

    if (!menuDelDia) {
      throw new Error("No se encontró un menú disponible para el día actual.");
    }

    return menuDelDia.platillo; // Devuelve la lista de platillos del menú del día
  } catch (error) {
    throw new Error("Error al obtener los platillos del menú del día: " + error.message);
  }
};






export async function obtenerComandasConPlatillos() { 
  const comandaRepository = AppDataSource.getRepository(Comanda);

  const comandas = await comandaRepository
    .createQueryBuilder("comanda")
    .leftJoinAndSelect(ConformaComanda, "conforma", "conforma.id_comanda = comanda.id_comanda")
    .leftJoinAndSelect("comanda.usuario", "usuario") 
    .leftJoinAndSelect(Platillo, "platillo", "conforma.id_platillo = platillo.id_platillo") 
    .select([
      "comanda.id_comanda", 
      "comanda.fecha_compra_comanda", 
      "conforma.id_platillo", 
      "conforma.cantidad_platillo", 
      "conforma.estado_platillo",   
      "usuario.id_usuario", 
      "platillo.nombre_platillo"
    ])
    .getRawMany();

  const comandasEnHorario = [];

  for (const comanda of comandas) {
    try {
      // Verifica el horario laboral del usuario asignado a la comanda
      await verificarHorarioLaboral(comanda.usuario_id_usuario);
      comandasEnHorario.push({
        idComanda: comanda.comanda_id_comanda,
        fecha: format(new Date(comanda.comanda_fecha_compra_comanda), "yyyy-MM-dd"), 
        tienePlatillos: comanda.conforma_id_platillo !== null,
        cantidad: comanda.conforma_cantidad_platillo, 
        nombrePlatillo: comanda.platillo_nombre_platillo,
        idPlatillo: comanda.conforma_id_platillo,
        estadoPlatillo: comanda.conforma_estado_platillo 
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
    relations: ["usuario"]
  });
  if (!comanda) throw new Error("Comanda no encontrada.");

  // Verificación de horario laboral del usuario asignado a la comanda
  await verificarHorarioLaboral(comanda.usuario.id_usuario);

  // Obtener el menú diario automáticamente
  const currentDate = new Date();
  let menu = await menuRepository.findOne({
    where: { fecha: currentDate.toISOString().split("T")[0], disponibilidad: true },
    relations: ["platillo"] // Carga los platillos del menú
  });

  // Si no hay menú para hoy, obtener el menú más cercano anterior
  if (!menu) {
    menu = await menuRepository.createQueryBuilder("menu")
      .where("menu.fecha <= :currentDate", { currentDate })
      .andWhere("menu.disponibilidad = true")
      .orderBy("menu.fecha", "DESC")
      .leftJoinAndSelect("menu.platillo", "platillo")
      .getOne();
  }

  if (!menu) throw new Error("No hay un menú disponible.");

  // Verificar si el platillo existe
  const platillo = await platilloRepository.findOne({
    where: { nombre_platillo: platilloData.nombre_platillo }
  });
  if (!platillo) throw new Error("Platillo no encontrado.");

  // Verificar si el platillo está en el menú activo
  if (!menu.platillo.some(p => p.id_platillo === platillo.id_platillo)) {
    throw new Error("El platillo no está en el menú activo.");
  }

  // Crear la relación en ConformaComanda
  const newConforma = conformaRepository.create({
    comanda: comanda,
    platillo: platillo,
    estado_platillo: platilloData.estado || "pendiente",
    cantidad_platillo: platilloData.cantidad || 1
  });

  // Guardar la relación en la base de datos
  await conformaRepository.save(newConforma);

  return newConforma;
}





export async function createComanda(loggedUser) {
  
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const usuarioRepository = AppDataSource.getRepository(Usuario);

  // Buscar al usuario logueado en la base de datos
  const usuario = await usuarioRepository.findOne({
    where: { id_usuario: loggedUser.id_usuario }
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  // Validar que el rol sea "mesero"
  if (usuario.rol_usuario !== "mesero") {
    throw new Error("Solo el rol 'mesero' tiene permiso para crear comandas.");
  }
 
  await verificarHorarioLaboral(loggedUser.id_usuario);

  // Obtener la fecha y hora actuales
  const fechaActual = new Date();
  const fechaCompra = fechaActual.toISOString().split("T")[0]; // YYYY-MM-DD
  const horaCompra = fechaActual.toTimeString().split(" ")[0]; // HH:MM:SS

 

  // Crear la comanda con los valores dinámicos
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,
    estado_comanda: "pendiente", // Estado predeterminado
    fecha_compra_comanda: fechaCompra,
    hora_compra_comanda: horaCompra,
  });

  // Guardar la comanda en la base de datos
  await comandaRepository.save(nuevaComanda);

  return nuevaComanda;
}




export async function removePlatilloFromComanda(comandaId, platilloId, loggedUser) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const conformaRepository = AppDataSource.getRepository(ConformaComanda);

  // Verificar si la comanda existe
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ["usuario"] // Relación con el usuario creador de la comanda
  });
  if (!comanda) throw new Error("Comanda no encontrada.");

  // Validar que el usuario logueado es el creador de la comanda
  if (comanda.usuario.id_usuario !== loggedUser.id_usuario) {
    throw new Error("No tienes permiso para eliminar platillos de esta comanda.");
  }

  // Verificar si la relación entre la comanda y el platillo existe
  const conforma = await conformaRepository.findOne({
    where: { id_comanda: comandaId, id_platillo: platilloId }
  });
  if (!conforma) throw new Error("El platillo no está asociado a esta comanda.");

  // Validar que el estado del platillo sea "pendiente"
  if (conforma.estado_platillo !== "pendiente") {
    throw new Error("Solo se pueden eliminar platillos con estado 'pendiente'.");
  }

  // Eliminar la relación de la tabla conforma_comanda
  await conformaRepository.delete({ id_comanda: comandaId, id_platillo: platilloId });

  return { message: "Platillo eliminado exitosamente de la comanda." };
}



export async function getAllComandas() {
  const comandaRepository = AppDataSource.getRepository(Comanda);

  // Obtener todas las comandas con la relación del usuario
  const comandas = await comandaRepository.find({ relations: ["usuario"] });

  // Filtrar las comandas según el horario laboral de cada usuario asociado
  const comandasEnHorario = [];

  for (const comanda of comandas) {
    try {
      // Verificar el horario laboral del usuario asociado a la comanda
     await verificarHorarioLaboral(comanda.usuario.id_usuario);
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
    relations: ["usuario"] // Relación con usuario
  });

  if (!comanda) throw new Error("Comanda no encontrada.");

  // Verificación de horario laboral del usuario asignado a la comanda
  await verificarHorarioLaboral(comanda.usuario.id_usuario);

  return comanda;
}


export async function updateComanda(comandaId, data) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ["usuario"] // Relación con usuario
  });

  if (!comanda) throw new Error("Comanda no encontrada.");

  // Verificación de horario laboral del usuario asignado a la comanda
  //await verificarHorarioLaboral(comanda.usuario.id_usuario);

  if (comanda.estado_comanda !== "pendiente") {
    throw new Error("La comanda no se puede modificar porque ya está completada o en otro estado.");
  }

  if (data.id_usuario && data.id_usuario !== comanda.usuario.id_usuario) {
    throw new Error("No se permite cambiar el ID del usuario asociado a la comanda.");
  }

  if (data.id_comanda && data.id_comanda !== comandaId) {
    throw new Error("No se permite cambiar el ID de la comanda.");
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
    relations: ["usuario"] // Relación con usuario
  });
  
  if (!comanda) throw new Error("Comanda no encontrada.");

  if(comanda.estado_comanda !== "pendiente") {
  throw new Error("La comanda no se puede eliminar porque ya está completada");
  }

  // Verificación de horario laboral del usuario asignado a la comanda
  await verificarHorarioLaboral(comanda.usuario.id_usuario);

  await conformaRepository.delete({ id_comanda: comandaId });
  await comandaRepository.remove(comanda);
  
  return comanda;
}




export async function completeComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);

  // Buscar la comanda por ID
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ["usuario"]
  });

  if (!comanda) {
    throw new Error("Comanda no encontrada.");
  }

  // Verificar el horario laboral del usuario
  await verificarHorarioLaboral(comanda.usuario.id_usuario);

  // Validar que el estado sea "pendiente"
  if (comanda.estado_comanda !== "pendiente") {
    throw new Error(`La comanda no se puede completar porque está en estado "${comanda.estado_comanda}".`);
  }

  // Cambiar el estado de la comanda directamente
  const result = await comandaRepository.update(comandaId, { estado_comanda: "completada" });

  if (result.affected === 0) {
    throw new Error("Error al actualizar el estado de la comanda.");
  }

  // Retornar la comanda actualizada
  const updatedComanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ["usuario"]
  });

  return updatedComanda;
}



