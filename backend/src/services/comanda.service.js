// backend/src/services/comanda.service.js
import Comanda from "../entity/comanda.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Platillo from "../entity/platillo.entity.js";
import ConformaComanda from "../entity/conforma_comanda.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { format } from "date-fns";
import Menu from "../entity/menu.entity.js";
import { getCurrentChileanTime, truncateToMinutes } from "../utils/dateUtils.js"; 


export async function getPlatillosDelDiaService(){
  const menuRepository = AppDataSource.getRepository(Menu);

  try {
    
    const menuDisponible = await menuRepository
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.platillo", "platillo") 
      .where("menu.disponibilidad = :disponible", { disponible: true })
      .getOne();

    if (!menuDisponible) {
      throw new Error("No se encontró un menú disponible para el día actual.");
    }

    return menuDisponible.platillo; 
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

  //Verificar si la comanda está completada
  if (comanda.estado_comanda === "completada") {
    throw new Error("No se pueden añadir platillos a una comanda completada.");
  }

  // Obtener el menú disponible
  const menu = await menuRepository.findOne({
    where: { disponibilidad: true },
    relations: ["platillo"],
  });
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




// Buscar si el platillo ya existe en la comanda
const platilloExistente = await conformaRepository.findOne({
  where: {
    comanda: { id_comanda: comandaId },
    platillo: { id_platillo: platillo.id_platillo }
  }
});


// Si el platillo ya existe y tiene estado "preparado", no se permite sumar ni añadir
if (platilloExistente && platilloExistente.estado_platillo === "preparado") {
  throw new Error(
    `No se puede modificar el platillo "${platillo.nombre_platillo}" porque su estado es "preparado".`
  );
}


if (platilloExistente) {
  // Si ya existe, sumar la cantidad
  platilloExistente.cantidad_platillo += platilloData.cantidad || 1;
  await conformaRepository.save(platilloExistente);
  return platilloExistente;
} else {



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
}



export async function createComanda(loggedUser, platilloData) {
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


// Obtener la fecha y hora actual ajustada a UTC-3
const fechaActual = getCurrentChileanTime(); // Obtiene la hora actual en Chile
const fechaTruncada = truncateToMinutes(fechaActual); // Elimina segundos y milisegundos

const fechaCompra = fechaTruncada.toISOString().split("T")[0]; // Formato YYYY-MM-DD
const horaCompra = fechaTruncada.toTimeString().split(" ")[0]; // Formato HH:MM:SS



  // Crear la comanda con los valores dinámicos
  const nuevaComanda = comandaRepository.create({
    usuario: usuario,
    estado_comanda: "pendiente", // Estado predeterminado
    fecha_compra_comanda: fechaCompra,
    hora_compra_comanda: horaCompra,
  });

  // Guardar la comanda
  const savedComanda = await comandaRepository.save(nuevaComanda);

  

  // Añadir el platillo a la comanda usando la función existente
  await addPlatilloToComanda(savedComanda.id_comanda, platilloData);

  return savedComanda;
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


    // Verificar si algún platillo tiene el estado "preparado"
    const platillosEnComanda = await conformaRepository.find({
      where: { comanda: { id_comanda: comandaId } }
    });
  
    const tienePlatilloPreparado = platillosEnComanda.some(
      (platillo) => platillo.estado_platillo === "preparado"
    );
  
    if (tienePlatilloPreparado) {
      throw new Error("No se puede eliminar la comanda porque contiene platillos en estado 'preparado'.");
    }

  await conformaRepository.delete({ id_comanda: comandaId });
  await comandaRepository.remove(comanda);
  
  return comanda;
}


export async function completeComanda(comandaId) {
  const comandaRepository = AppDataSource.getRepository(Comanda);
  const conformaRepository = AppDataSource.getRepository(ConformaComanda);

  // Buscar la comanda por ID
  const comanda = await comandaRepository.findOne({
    where: { id_comanda: comandaId },
    relations: ["usuario"]
  });

  if (!comanda) {
    throw new Error("Comanda no encontrada.");
  }

  // Validar que el estado sea "pendiente"
  if (comanda.estado_comanda !== "pendiente") {
    throw new Error(`La comanda no se puede completar porque está en estado "${comanda.estado_comanda}".`);
  }

  //Verificar que todos los platillos asignados estén "preparados"
  const platillosEnComanda = await conformaRepository.find({
    where: { comanda: { id_comanda: comandaId } },
  });

  if (platillosEnComanda.length === 0) {
    throw new Error("La comanda no tiene platillos asignados.");
  }

  const hayPlatillosPendientes = platillosEnComanda.some(
    (platillo) => platillo.estado_platillo !== "preparado"
  );

  if (hayPlatillosPendientes) {
    throw new Error(
      "No se puede completar la comanda porque hay platillos con estado pendiente."
    );
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

