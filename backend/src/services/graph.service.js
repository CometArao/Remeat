"use strict";
import { AppDataSource, connectDB } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js"
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"
import Platillo from "../entity/platillo.entity.js"
import TipoIngrediente from "../entity/tipo_ingrediente.entity.js"
import Comanda from "../entity/comanda.entity.js"

/* 
Dada una lista de ids devuelve la cantidad vigente en el sistema
de utensilios, para esto descuenta la cantidad de mermas y agrega la 
cantidad de pedidos

ids_tipos_utensilio = {
  ids: [
    1,2,3,... 
  ]
result = {
  id_utensilio [
    {
      fecha: {fecha actual},
      cantidad_utensilios: {cantidad_utensilios}
    },
    ...
  ]
}
*/
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
      INNER JOIN pedido p ON p.id_pedido = u.id_pedido
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
      console.log(utensilio)
      cantidad_total += utensilio.cantidad_utensilio
      const par_cantidad_fecha_pedido = {
        fecha: utensilio.fecha_compra_pedido,
        cantidad_utensilio: utensilio.cantidad_utensilio,
        cantidad_total: cantidad_total
      }
      console.log("par_cantidad_fecha")
      console.log(cantidad_total)
      console.log(par_cantidad_fecha_pedido)
      inventarioDelTipo.push(par_cantidad_fecha_pedido)
      const mermas = await AppDataSource.query(`
        SELECT um.cantidad_perdida_utensilio, m.fecha_merma
        FROM merma m
        INNER JOIN utensilio_merma um ON um.id_merma = m.id_merma
        WHERE um."id_utensilio" = $1
        `, [utensilio["id_utensilio"]])
      console.log("merma");
      console.log(mermas);
      //aqui se añaden las cantidades de las mermas
      for (let i = 0; i < mermas.length; i++) {
        const merma = mermas[i];
        cantidad_total -= merma.cantidad_perdida_utensilio;
        const par_cantidad_fecha_merma = {
          fecha: merma.fecha_merma,
          cantidad_utensilio: merma.cantidad_perdida_utensilio,
          cantidad_total: cantidad_total
        }
        inventarioDelTipo.push(par_cantidad_fecha_merma)
      }
    }
    result[id_tipo_utensilio] = inventarioDelTipo
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
        return [null,
          "El tipo de ingrediente con id: " + id_tipo_ingrediente + "no existe"]
      }
      const ingredientes = await AppDataSource.query(`
    SELECT * 
    FROM tipo_ingrediente ti
    INNER JOIN ingrediente i ON i.id_tipo_ingrediente = ti.id_tipo_ingrediente
    INNER JOIN pedido p ON p.id_pedido = i.id_pedido
    WHERE ti.id_tipo_ingrediente = $1
    `, [id_tipo_ingrediente])
      console.log("ingredientes");
      console.log(ingredientes);
      if (!ingredientes || ingredientes.length == 0) {
        return [null, "No se encontraron ingredientes asociados a ese tipo"]
      }
      //Por cada ingrediente mirar mermas y pedidos
      for (let i = 0; i < ingredientes.length; i++) {
        const ingrediente = ingredientes[i];
        const par_cantidad_fecha_pedido = {
          fecha: ingrediente.fecha_compra_pedido,
          cantidad_ingrediente: ingrediente.cantidad_ingrediente,
          tipo: "pedido"
        }
        inventarioDelTipo.push(par_cantidad_fecha_pedido);
        const listaInfoMermas = await getInfoMermasDeIngrediente(ingrediente.id_ingrediente);
        //a considerar
        //push apply es mas eficiente que el operador ...
        inventarioDelTipo = [...inventarioDelTipo, ...listaInfoMermas];

      }
      //Mirar comandas
      const listInfoComandas = await getInfoComandasDeTipoIngrediente(id_tipo_ingrediente);
      inventarioDelTipo = [...inventarioDelTipo, ...listInfoComandas]
      //Barajar comandas con pedidos y mermas
      inventarioDelTipo.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      if(tipoIngredienteEncontrado == null) {
        return [null, "Deberia ser imposible llegar aqui; El tipo de ingrediente es nulo"];
      }
      //Ahora que tenemos todos los cambios y en orden de fecha calcular el stock total
      let cantidad_total = 0;
      for(let i = 0; i < inventarioDelTipo.length; i++) {
        cantidad_total += inventarioDelTipo[i]["cantidad_ingrediente"];
        inventarioDelTipo[i]["cantidad_total"] = cantidad_total;
      }
      result[tipoIngredienteEncontrado.nombre_tipo_ingrediente] = inventarioDelTipo;
    }
    return [result, null];
    /**
     * Para realizar esta parte nesesito tener claro como se realiza el descuento
     * de los ingredientes. ¿Deberia existir una relacion entre ingredientes y comandas para
     * saber cuando se consumio? O solo usar el tipo de ingrediente para ver
     * que platillos usan ese ingrediente y cuando se consumieron.
     */

  }catch (error) {
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
  console.log(id_tipo_ingrediente)
  //Me importa la cantidad de platillos
  //que pasa con cantidad
  const comandas = await AppDataSource.query(`
    SELECT c.fecha_compra_comanda, cc.cantidad_platillo, cp.porcion_ingrediente_platillo
    FROM comanda c
    INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
    INNER JOIN platillo p ON p.id_platillo = cc.id_platillo
    INNER JOIN compuesto_platillo cp ON cp.id_platillo = p.id_platillo
    INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = cp.id_tipo_ingrediente
    WHERE ti.id_tipo_ingrediente = $1
    `, [id_tipo_ingrediente])
  for (let i = 0; i < comandas.length; i++) {
    const comanda = comandas[i];
    //Para calcular la cantidad de la comanda se usa
    //porcion del ingrediente * cantidad de platillos
    const par_cantidad_fecha_comanda = {
      fecha: comanda.fecha_compra_comanda,
      cantidad_ingrediente: -comanda.cantidad_platillo * comanda.porcion_ingrediente_platillo,
      tipo: "comanda"
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
   * 
   * 
   * 
   */
  try {
    const platillosRepository = AppDataSource.getRepository(Platillo)
    const platillosEncontrados = await platillosRepository.find()
    if (!platillosEncontrados) {
      return [null, "No se encontro ningun platos"]
    }
    console.log("test")
    console.log(platillosEncontrados)
    console.log(platillosEncontrados.length)
    let listaVentas = []


    for (let i = 0; i < platillosEncontrados.length; i++) {
      //let platillo = platillosEncontrados[i]
      //console.log(platillo)
      //ventasPorPlatillo = await AppDataSource.createQueryBuilder()
      //.select("platillo")
      //.from(Platillo, "platillo")
      //.innerJoinAndSelect(platillo.compuestoPlatillo, "conpuesto_platillo",)
      //.where("platillo.id = :id", platillo.id_platillo)
      //.getMany()
      //console.log("test")
      //console.log(ventasPorPlatillo)
      let ventasPlatillo = {}
      console.log("test")
      const platillo_comanda = await AppDataSource.query(`
  SELECT COUNT(1) as count
  FROM platillo p
  INNER JOIN conforma_comanda cc ON p.id_platillo = cc.id_platillo
  WHERE p.id_platillo = $1
  `, [platillosEncontrados[i].id_platillo])
      console.log(platillo_comanda)
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
export async function getMenuPlatilloService() {
  /**
   * Quiero que mi resultado se vea:
   * [
      * {
      *  id_platillo: id_platillo
      *  nombre_platillo: nombre_platillo
      *  en_el_menu: cantidad_en_menu
      * },
      * {
      *   etc
      * }
   * ]
   * 
   * 
   */
  const platillosRepository = AppDataSource.getRepository(Platillo)
  const platillosEncontrados = await platillosRepository.find()
  if (!platillosEncontrados) {
    return [null, "No se encontro ningun plato"]
  }
  try {
    for (platillo in platillosEncontrados) {
      //ventasPorPlatillo = await AppDataSource.createQueryBuilder()
      //.select("platillo")
      //.from(Platillo, "platillo")
      //.innerJoinAndSelect(platillo.menu, "menu",)
      //.where("platillo.id = :id", { id: platillo.id_platillo })
      //.getMany()
      //console.log("test")
      //console.log(ventasPorPlatillo)

      let platillosPorMenu = {}
      platillosPorMenu["id_platillo"] = platillosEncontrados[i].id_platillo
      platillosPorMenu["nombre_platillo"] = platillosEncontrados[i].nombre_platillo
      //Se asume que platillo menu tiene forma de diccionario
      const platillo_menu = await AppDataSource.query(` 
      SELECT p.id_platillo, COUNT(1) as count
      FROM platillo p
      INNER JOIN menu_platillo_platillo mpp ON p.id_platillo = mpp.id_platillo
      INNER JOIN menu m ON mpp.id_menu = m.id_menu
      WHERE p.id_platillo = $1
      GROUP BY p.id_platillo`
        , [platillosEncontrados[i].id_platillo])
      console.log(platillo_menu)
      platillosPorMenu["en_el_menu"] = platillo_menu["count"]
    }
    return [platillosPorMenu, null]
  } catch (error) {
    console.error("error en consulta menu_platillos")
  }
}

//ignorar
export async function getGraficoLinea(dependiente, independiente, ingrediente, platillo) {
  switch (independiente) {

  }
  /*
  Graficos de linea {
    stock ingrediente vs fecha(ultimas x fechas) {
      consultar cantidad actual.
      consultar todos los pedidos  (hechos en las ultimas x fechas)
      comandas con ese ingrediente (hechos en las ultimas x fechas)
    }
    ingresos_ventas vs fecha(ultimas x fechas) {
      consultar comandas
      sumar el precio de todos los platillos de todas las comandas
      entregar un listado con la suma de las ventas por fecha
    }
    ingresos_cantidad_ventas por un platillo vs fecha {
      consultar platillo
      consultar comandas con ese platillo
    }
    costos vs fecha {
      consultar pedidos y sus relaciones con ingredientes y utensilios
    }
    Utilidades vs fecha {
      consultar costos consultar ventas
    }
  }
  Graficos Circulares {
    Ventas por platillo {
      consultar platillos 
      consultar comandas
      se calcula num_platillos_vendidos / cantidad de relaciones comanda-platillo
    }
    Porcentaje de veces que se añadio al menu {
      consultar platillos
      consultar menus
      se calcula num_platillo_en_menu / cantidad de relaciones menu-platillo
    }
  }
  Grafico Barra {
    Ventas por platillo {
      consultar platillos 
      consultar comandas
    }
    Porcentaje de veces que se añadio al menu {
      consultar platillos
      consultar menus
    }
  }
  tiene que ser un diccionario de forma
  datos = {
    //recordar convertir la fecha de la base de datos a fecha js
    Date(fecha) : cantidad_ingrediente
  }



  (mingrediente)
  SELECT *
  FROM ingrediente i
  WHERE i.cantidad_ingrediente = mingrediente
  INNER JOIN tipo_ingrediente ti ON ti.id_tipo_ingrediente = i.id_ingrediente
  INNER JOIN compuesto_platillo cp ON ti.id_tipo_ingrediente = cp.id_tipo_ingrediente
  INNER JOIN platillo p ON p.id_platillo = cp.id_platillo
  INNER JOIN conformada_comanda cc ON p.id_platillo = cc.id_platillo
  INNER JOIN comandas c ON c.id_comanda = cc.id_comanda
  INNER JOIN 
  */
  //¿como tiene que verse en el front end?

}
////get ingresos venta
//export async function getIngresosVenta() {

//comandas = await AppDataSource.query(`
//SELECT c.id_comanda, SUM(precio_platillo) as precio_total, c.fecha_compra_comanda, hora_compra_comanda
//FROM comandas c
//INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
//INNER JOIN platillo p ON p.id_platillo = cc.id_platillo
//GROUP BY c.id_comanda
//`)//salen las id_platillo repetidas ¿?
//let ventas_comanda = 0;
//let venta_fecha = {}
//for (let i = 0; i < ventas_totales.length; i++) {
//ventas_comanda += comandas[i]['precio_platillo']
//}
//venta_fecha['fecha'] = comandas[i]['fecha_compra']
//venta_fecha['hora'] = comandas[i]['hora_compra_comanda']
//venta_fecha['ventas'] = ventas_comanda
//return [venta_fecha, null]
//}

//get ingresos venta
//export async function getIngresosVentasService() {
//const platillosRepository = AppDataSource.getRepository(Platillo)
//const platillosEncontrados = await platillosRepository.find()
//if (!platillosEncontrados) {
//return [null, "El platillo seleccionado no existe"]
//}
//console.log(platillosEncontrados)
//// guardar cantidad de veces que se asocia comanda con platillo
//// 
////tengo que conectar con comanda para saber la fecha
///*
//Lo que quiero devolver es algo:
//[
//{
//platillo: id_platillo,
//ventas_por_comanda: [
//{
//fecha_compra: fecha_compra_comanda,
//hora_compra: hora_compra_comanda,
//cantidad_ventas: cantidad_ventas
//}
//]
//}
//]

//*/
//let result = {}
//let outer_json = {}
//outer_json['platillo'] = platillosEncontrados.id_platillo

//let cantidadVentasPlatillos = []

//for (let j = 0; j < platillosEncontrados.length; j++) {
//const id_platillo = platillosEncontrados[j].id_platillo
//console.log("id_platillo")
//console.log(id_platillo)
////obtiene todas las comandas asociadas al platillo
//let comandas_platillo = await AppDataSource.query(`
//SELECT c.id_comanda, cc.id_platillo, c.fecha_compra_comanda, c.hora_compra_comanda
//FROM comanda c
//INNER JOIN conforma_comanda cc ON cc.id_comanda = c.id_comanda
//WHERE cc.id_platillo = $1
//`, [id_platillo])
//console.log("comandas_platillo")
//console.log(comandas_platillo)
////verificar que existan comandas asociadas al platillo
//if (!comandas_platillo || comandas_platillo.length === 0) {
//return [null, "no existen comandas asociadas"]
//}
////cuanta la cantidad de veces que se vendio el platillo en esta comanda
//for (let i = 0; i < comandas_platillo.length; i++) {
//const comanda = comandas_platillo[i]
//let dict_ventas_platillo = {}
//console.log(comanda['hora_compra_comanda'])

//dict_ventas_platillo['fecha_compra'] = comanda['fecha_compra_comanda']
//dict_ventas_platillo['hora_compra'] = comanda['hora_compra_comanda']


//const ventas_platillo = AppDataSource.query(`
//SELECT COUNT(1) as count 
//FROM comanda c
//INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
//WHERE c.id_comanda = $1
//`, [comandas_platillo])
//console.log(ventas_platillo)
//dict_ventas_platillo['cantidad_ventas'] = ventas_platillo['count']
//cantidadVentasPlatillos.push(dict_ventas_platillo)
//}
//outer_json['ventas_por_comanda'] = cantidadVentasPlatillos
//console.log("outerjson")
//console.log(outer_json)
//result[id_platillo] = outer_json
//console.log(result)
//}
//console.log("ventas_platillo: " + result);
//return [result, null]
//}
export async function getIngresosVentasService() {
  const platillosRepository = AppDataSource.getRepository(Platillo);
  const platillosEncontrados = await platillosRepository.find();

  if (!platillosEncontrados) {
    return [null, "El platillo seleccionado no existe"];
  }

  console.log(platillosEncontrados);

  let result = {};

  for (let j = 0; j < platillosEncontrados.length; j++) {
    const id_platillo = platillosEncontrados[j].id_platillo;
    console.log("id_platillo:", id_platillo);

    // Obtiene todas las comandas asociadas al platillo
    const comandas_platillo = await AppDataSource.query(`
          SELECT c.id_comanda, cc.id_platillo, c.fecha_compra_comanda, c.hora_compra_comanda
          FROM comanda c
          INNER JOIN conforma_comanda cc ON cc.id_comanda = c.id_comanda
          WHERE cc.id_platillo = $1
      `, [id_platillo]);

    console.log("comandas_platillo:", comandas_platillo);

    // Verificar que existan comandas asociadas al platillo
    if (!comandas_platillo || comandas_platillo.length === 0) {
      continue; // Si no hay comandas, pasa al siguiente platillo
    }

    // Estructura para almacenar ventas por comanda
    let cantidadVentasPlatillos = [];

    // Recorre cada comanda para contar las ventas del platillo en esa comanda
    for (let i = 0; i < comandas_platillo.length; i++) {
      const comanda = comandas_platillo[i];
      let dict_ventas_platillo = {
        fecha_compra: comanda.fecha_compra_comanda,
        hora_compra: comanda.hora_compra_comanda
      };

      // Contar la cantidad de veces que el platillo fue vendido en esta comanda
      const ventas_platillo_result = await AppDataSource.query(`
              SELECT COUNT(1) as count 
              FROM conforma_comanda
              WHERE id_comanda = $1 AND id_platillo = $2
          `, [comanda.id_comanda, id_platillo]);

      dict_ventas_platillo["cantidad_ventas"] = ventas_platillo_result[0].count;
      cantidadVentasPlatillos.push(dict_ventas_platillo);
    }

    result[id_platillo] = {
      platillo: id_platillo,
      ventas_por_comanda: cantidadVentasPlatillos
    };
  }

  console.log("ventas_platillo:", result);
  return [result, null];
}
//para despues del miercoles
export async function getCostos() {
  /**
   * Resultado = [
   *  {
   *    comandas: {
      *    comanda: {
      *      costo: costo_comanda
      *      fecha_compra: fecha
   *      }
    *    mermas: {
    *       mermas: {
    *         tipo: "ingrediente"/"utensilio"
    *         costo_por_merma
    *         fecha_merma: fecha
    *       }
    *    }
    *    
   *    }
   *  }
   * ]
   * 
   * 
   * 
   */
  comandas = AppDataSource.query(`
    SELECT *
    FROM comanda c
    INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
    INNER JOIN 
    `)


}


//inventario actual
//`
//SELECT *
//FROM comanda c
//INNER JOIN conforma comanda cc
//INNER JOIN platillo p
//INNER JOIN tipo_ingrediente ti
//INNER JOIN 
//`