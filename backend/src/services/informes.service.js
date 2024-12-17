"use strict";
import { AppDataSource, connectDB } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js"
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"
import Platillo from "../entity/platillo.entity.js"
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js"
import Comanda from "../entity/comanda.entity.js"
import { compareOnlyDate, formatDateToISO } from "../utils/dateUtils.js";

export async function getUtensiliosDeTipoService(ids_tipos_utensilio) {
  const { ids } = ids_tipos_utensilio;
  const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
  let result = {};
  for (let i = 0; i < ids.length; i++) {
    const id_tipo_utensilio = ids[i];
    const tipoUtensilioEncontrado = await tipo_utensilioRepository.findOne({
      where: { id_tipo_utensilio: id_tipo_utensilio }
    })
    if (!tipoUtensilioEncontrado) {
      //No importa si el resto de las ids no se ve porque en el front end este error no deberia ser posible. 
      //Es solo si alguien esta accediendo a las urls directamente posiblemente intentando una inyeccion sql
      return [null, "El utensilio de id: " + id_tipo_utensilio + " no existe"]
    }

    //Creo que tiene mas sentido consultar los utensilios, despues consultar separadamente los pedidos y las mermas
    const utensilios = await AppDataSource.query(`
      SELECT *
      FROM tipo_utensilio tu
      INNER JOIN utensilio u ON u.id_tipo_utensilio = tu.id_tipo_utensilio 
      INNER JOIN compuesto_utensilio cu ON cu.id_utensilio = u.id_utensilio
      INNER JOIN pedido p ON p.id_pedido = cu.id_pedido
      WHERE tu.id_tipo_utensilio = $1
      ORDER BY p.fecha_entrega_pedido ASC
      `, [id_tipo_utensilio])
    //TODO: se usa fecha entrega o fecha compra
    //por cada utensilio restarle las mermas a la cantidad
    /*
      Para cada utensilio contar su cantidad menos las mermas de ese ingrediente. Contar por fechas, cada vez que se usa 
    */
    let cantidad_total = 0;
    let inventarioDelTipo = [];
    for (let i = 0; i < utensilios.length; i++) {
      const utensilio = utensilios[i];
      cantidad_total += utensilio.cantidad_utensilio
      const par_cantidad_fecha_pedido = {
        fecha: utensilio.fecha_compra_pedido,
        cantidad_utensilio: utensilio.cantidad_utensilio,
        cantidad_total: cantidad_total
      }
      inventarioDelTipo.push(par_cantidad_fecha_pedido)
      const mermas = await AppDataSource.query(`
        SELECT um.cantidad_perdida_utensilio, m.fecha_merma
        FROM merma m
        INNER JOIN utensilio_merma um ON um.id_merma = m.id_merma
        WHERE um."id_utensilio" = $1
        `, [utensilio["id_utensilio"]])
      //aqui se añaden las cantidades de las mermas
      for (let i = 0; i < mermas.length; i++) {
        const merma = mermas[i];
        cantidad_total -= merma.cantidad_perdida_utensilio;
        const par_cantidad_fecha_merma = {
          fecha: merma.fecha_merma,
          cantidad_utensilio: merma.cantidad_perdida_utensilio,
          cantidad_total: cantidad_total,
          evento: "merma"
        }
        inventarioDelTipo.push(par_cantidad_fecha_merma)
      }
    }
    result[tipoUtensilioEncontrado.nombre_tipo_utensilio] = inventarioDelTipo
  }
  return [result, null]
  //TODO: Las mermas se pueden crear con fecha anterior a la 
  //entrega del utensilio

  //el orden de las mermas no parece ser el correcto.
  //en principio con el anterior se deberia arreglar este
}
export async function getIngredientesDeTipoService(ids_tipo_ingrediente) {
  try {
    let result = {}
    let inventarioDelTipo = []
    const { ids } = ids_tipo_ingrediente;
    let tipoIngredienteEncontrado = null;
    const tipo_ingredienteRepositorio = AppDataSource.getRepository(TipoIngrediente);
    //Por cada tipo de ingrediente mirar el ingrediente
    for (let i = 0; i < ids.length; i++) {
      let inventarioDelTipo = [];
      const id_tipo_ingrediente = ids[i];
      tipoIngredienteEncontrado = await tipo_ingredienteRepositorio.findOne({
        where: { id_tipo_ingrediente: id_tipo_ingrediente }
      });
      if (!tipoIngredienteEncontrado) {
        continue
        //return [null,
        //"El tipo de ingrediente con id: " + id_tipo_ingrediente + "no existe"]
      }
      const ingredientes = await AppDataSource.query(`
    SELECT * 
    FROM tipo_ingrediente ti
    INNER JOIN ingrediente i ON i.id_tipo_ingrediente = ti.id_tipo_ingrediente
    INNER JOIN compuesto_ingrediente ci ON ci.id_ingrediente = i.id_ingrediente
    INNER JOIN pedido p ON p.id_pedido = ci.id_pedido
    WHERE ti.id_tipo_ingrediente = $1
    `, [id_tipo_ingrediente])
      if (!ingredientes || ingredientes.length == 0) {
        continue
        //return [null, "No se encontraron ingredientes asociados a ese tipo"]
      }
      //Por cada ingrediente mirar mermas y pedidos
      for (let i = 0; i < ingredientes.length; i++) {
        const ingrediente = ingredientes[i];
        //const hours = date.getHours().toString().padStart(2, '0');
        //const minutes = date.getMinutes().toString().padStart(2, '0');
        //const seconds = date.getSeconds().toString().padStart(2, '0');

        //const formattedTime = `${hours}:${minutes}:${seconds}`;
        const par_cantidad_fecha_pedido = {
          fecha: ingrediente.fecha_compra_pedido,
          //hora: formattedTime,
          cantidad_ingrediente: ingrediente.cantidad_original_ingrediente,
          tipo: "pedido"
        }
        inventarioDelTipo.push(par_cantidad_fecha_pedido);
        const listaInfoMermas = await getInfoMermasDeIngrediente(ingrediente.id_ingrediente);
        console.log(listaInfoMermas)
        //a considerar
        //push apply es mas eficiente que el operador ...
        inventarioDelTipo = [...inventarioDelTipo, ...listaInfoMermas];
      }
      //Mirar comandas
      const listInfoComandas = await getInfoComandasDeTipoIngrediente(id_tipo_ingrediente);
      inventarioDelTipo = [...inventarioDelTipo, ...listInfoComandas]

      //Barajar comandas con pedidos y mermas
      inventarioDelTipo.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      if (tipoIngredienteEncontrado == null) {
        return [null, "Deberia ser imposible llegar aqui; El tipo de ingrediente es nulo"];
      }
      //Como comandas y pedidos guardan la fecha de forma distinta

      //Ahora que tenemos todos los cambios y en orden de fecha calcular el stock total
      let cantidad_total = 0;
      for (let i = 0; i < inventarioDelTipo.length; i++) {
        cantidad_total += inventarioDelTipo[i]["cantidad_ingrediente"];
        inventarioDelTipo[i]["cantidad_total"] = cantidad_total;
      }
      result[tipoIngredienteEncontrado.nombre_tipo_ingrediente] = inventarioDelTipo;
    }
    return [result, null];
  } catch (error) {
    console.log(error);
    return [null, "Error en el service"]
  }

}
//retorna lista de pares cantidad_fecha_merma en una lista
//no es export porque es solo de uso interno
async function getInfoMermasDeIngrediente(id_ingrediente) {
  let result = [];
  //TODO: remplazar nombre de merma (relacion cantidad ¿?)
  const mermas = await AppDataSource.query(`
      SELECT m.fecha_merma, im.cantidad_perdida_ingrediente
      FROM merma m
      INNER JOIN ingrediente_merma im on im.id_merma = m.id_merma
      INNER JOIN ingrediente i ON im.id_ingrediente = i.id_ingrediente
      WHERE i.id_ingrediente = $1
      `, [id_ingrediente]);
  for (let i = 0; i < mermas.length; i++) {
    const merma = mermas[i];
    const par_cantidad_fecha_merma = {
      fecha: merma.fecha_merma,
      cantidad_ingrediente: -merma.cantidad_perdida_ingrediente,
      tipo: "merma"
    }
    result.push(par_cantidad_fecha_merma);
  }
  return result;
}
/**
 * 
 * dada una id de tipo_ingrediente
 * crea una lista de diccionarios con la fecha de la comanda y la cantidad
 * usada de ese ingrediente en esa comanda
 */
async function getInfoComandasDeTipoIngrediente(id_tipo_ingrediente) {
  let result = [];
  //Me importa la cantidad de platillos
  //que pasa con cantidad
  const comandas = await AppDataSource.query(`
    SELECT c.fecha_compra_comanda, cc.cantidad_platillo, cp.porcion_ingrediente_platillo, 
      p.precio_platillo, c.hora_compra_comanda
    FROM comanda c
    INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
    INNER JOIN platillo p ON p.id_platillo = cc.id_platillo
    INNER JOIN compuesto_platillo cp ON cp.id_platillo = p.id_platillo
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = cp.id_tipo_ingrediente
    WHERE ti.id_tipo_ingrediente = $1 AND
    cc.estado_platillo = 'preparado' AND
    cc.estado_platillo = 'entregado'

    `, [id_tipo_ingrediente])
  if (!comandas) {
    return null;
  }
  for (let i = 0; i < comandas.length; i++) {
    const comanda = comandas[i];
    //Para calcular la cantidad de la comanda se usa
    //porcion del ingrediente * cantidad de platillos
    console.log(comanda)
    //Extrae las horas minutos y segundos y convierte cada uno en un numero
    const [targetHours, targetMinutes, targetSeconds] =
      comanda.hora_compra_comanda.split(':').map(num => parseInt(num))
    let fecha_comanda = new Date(comanda.fecha_compra_comanda)
    fecha_comanda.setHours(targetHours, targetMinutes, targetSeconds)
    const fechaIso = fecha_comanda.toISOString()
    const par_cantidad_fecha_comanda = {
      fecha: fechaIso,
      hora: comanda.hora_compra_comanda,
      cantidad_ingrediente: -(comanda.cantidad_platillo * comanda.porcion_ingrediente_platillo),
      tipo: "comanda",
    }
    result.push(par_cantidad_fecha_comanda);
  }
  return result;
}
//Para grafico de barras y circular
//Listo pero sin probar
export async function getVentasPlatilloService() {
  /**
   * resultados
   * [
   *  {
   *    id_platillo: id_platillo
   *    ventas: ventas
   *  }
   * ]
   */
  try {
    const platillosRepository = AppDataSource.getRepository(Platillo)
    const platillosEncontrados = await platillosRepository.find()
    if (!platillosEncontrados) {
      return [null, "No se encontro ningun platos"]
    }
    let listaVentas = []


    for (let i = 0; i < platillosEncontrados.length; i++) {
      let ventasPlatillo = {}
      console.log("test")
      const platillo_comanda = await AppDataSource.query(`
  SELECT COUNT(1) as count
  FROM platillo p
  INNER JOIN conforma_comanda cc ON p.id_platillo = cc.id_platillo
  WHERE p.id_platillo = $1
  `, [platillosEncontrados[i].id_platillo])
      ventasPlatillo["ventas"] = platillo_comanda["count"]
    }

    return [ventasPlatillo, null]
  } catch (error) {
    console.error("error en consulta ventas platillo", error)
    return [null, "error consulta"]
  }
}
//Para grafico de barras y circular
//Listo pero sin probar
export async function getMenuPlatilloService(ids_platillo) {
  /**
   * data: {
   *    id_platillo {
   *      nombre_platillo:
   *      menu: [
   *         fecha,fecha2,fecha3 //ordenadas
   *      ] 
   *    }
   * }
   */
  try {
    console.log(ids_platillo)
    const { ids } = ids_platillo
    let result = []
    const platillosRepository = AppDataSource.getRepository(Platillo)
    //const platillosEncontrados = await platillosRepository.find({
    //relations: ['menus']
    //})
    for (let i = 0; i < ids.length; i++) {
      const id_platillo = ids[i];
      const platillosEncontrados = await AppDataSource.query(`
      SELECT * 
      FROM platillo p
      WHERE p.id_platillo = $1
    `, [id_platillo])
      console.log(id_platillo)
      console.log(platillosEncontrados)
      if (!platillosEncontrados) {
        //Se continua si no tiene platillos esta id
        continue
      }
      for (let i = 0; i < platillosEncontrados.length; i++) {
        let platillo = platillosEncontrados[i];
        const menusDelPlatillo = await AppDataSource.query(`
        SELECT *
        FROM menu m
        INNER JOIN menu_platillo_platillo mpp ON mpp."menuIdMenu" = m.id_menu
        WHERE mpp."platilloIdPlatillo" = $1
        `, [id_platillo])
        console.log("menusDelPlatillo")
        console.log(menusDelPlatillo)
        if (!menusDelPlatillo) {
          //Se deja una lista vacia para que tenga .length 0
          platillo.menu = []
          continue
        }
        platillo.menu = menusDelPlatillo;
        result.push(platillo)
      }
    }
    //console.log("platillosEncontrados")
    //console.log(platillosEncontrados)
    console.log(result)
    return [result, null]
  } catch (error) {
    console.log(error)
    return [null, "Error en getMenuPlatillos"]
  }
}

export async function getIngresosVentasService(ids_platillo) {
  const { ids } = ids_platillo
  if (!ids) {
    return [null, "No se enviaron platillos a consultar"];
  }
  let result = {}
  const platillosRepository = AppDataSource.getRepository(Platillo);
  for (let i = 0; i < ids.length; i++) {
    const id_platillo = ids[i];
    const platillo = await platillosRepository.findOne({
      where: { id_platillo: id_platillo }
    })
    if (!platillo) {
      return [null, "El platillo buscado no se encuentra"]
    }
    const comandas_platillo = await AppDataSource.query(`
          SELECT c.fecha_compra_comanda, c.hora_compra_comanda,
          cc.cantidad_platillo
          FROM comanda c
          INNER JOIN conforma_comanda cc ON cc.id_comanda = c.id_comanda
          WHERE cc.id_platillo = $1 AND
          c.estado_comanda = 'completada'
      `, [id_platillo]);
    console.log("comandas_platillo")
    console.log(comandas_platillo)
    console.log(id_platillo)
    if (!comandas_platillo || comandas_platillo.length === 0) {
      continue;
    }
    let cantidadVentasPlatillos = []
    for (let i = 0; i < comandas_platillo.length; i++) {
      const comanda = comandas_platillo[i];
      let dict_ventas_platillo = {
        fecha_compra: comanda.fecha_compra_comanda,
        hora_compra: comanda.hora_compra_comanda,
        cantidad_platillo: comanda.cantidad_platillo,
        ingresos_platillo: comanda.cantidad_platillo * platillo.precio_platillo
      };

      cantidadVentasPlatillos.push(dict_ventas_platillo);
    }

    result[platillo.nombre_platillo] = {
      ventas_por_comanda: cantidadVentasPlatillos
    };
  }
  return [result, null];
}
