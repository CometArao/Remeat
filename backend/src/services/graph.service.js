"use strict";
import { AppDataSource, connectDB } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js"
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"
import Platillo from "../entity/platillo.entity.js"
import Comanda from "../entity/comanda.entity.js"


//para despues del miercoles
export async function getUtensiliosDeTipoService(id_tipo_utensilio) {
  const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
  const utensilioRepository = AppDataSource.getRepository(Utensilio);
  //validar que existe el tipo
  const tipoUtensilioEncontrado = await tipo_utensilioRepository.findOne({
    where: [{ id_tipo_utensilio: id_tipo_utensilio }]
  })
  if (!tipoUtensilioEncontrado) {
    return [null, "No se encontro ese tipo de utensilio"]
  }
  const utensilios = await utensilioRepository.find({
    where: [{ id_tipo_utensilio: id_tipo_utensilio }]
  })
  console.log("utensilios")
  console.log(utensilios)
  return [utensilios, null]
}
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
      ventasPlatillo['ventas'] = platillo_comanda['count']
    }
    return [platillo_comanda, null]
  } catch (error) {
    console.error("error en consulta ventas platillo", error)
    return [null, "error consulta"]
  }
}
//Para grafico de barras y circular
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
      platillosPorMenu['id_platillo'] = platillosEncontrados[i].id_platillo
      platillosPorMenu['nombre_platillo'] = platillosEncontrados[i].nombre_platillo 
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
      platillosPorMenu['en_el_menu'] = platillo_menu['count']
    }
    return [platillosPorMenu, null]
  } catch (error) {
    console.error("error en consulta menu_platillos")
  }
}

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
export async function getVentasComandas() {

  comandas = await AppDataSource.query(`
    SELECT c.id_comanda, SUM(precio_platillo) as precio_total, c.fecha_compra_comanda, hora_compra_comanda
    FROM comandas c
    INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
    INNER JOIN platillo p ON p.id_platillo = cc.id_platillo
    GROUP BY c.id_comanda
    `)//salen las id_platillo repetidas ¿?
  let ventas_comanda = 0;
  let venta_fecha = {}
  for (let i = 0; i < ventas_totales.length; i++) {
    ventas_comanda += comandas[i]['precio_platillo']
  }
  venta_fecha['fecha'] = comandas[i]['fecha_compra']
  venta_fecha['hora'] = comandas[i]['hora_compra_comanda']
  venta_fecha['ventas'] = ventas_comanda
  return [venta_fecha, null]
}
export async function getCantidadVentasPlatillo(id_platillo) {
  const platillosRepository = AppDataSource.getRepository(Platillo)
  const platilloEncontrado = platillosRepository.findOne(Platillo)
  if (!platilloEncontrado) {
    return [null, "El platillo seleccionado no existe"]
  }

  // guardar cantidad de veces que se asocia comanda con platillo
  // 
  //tengo que conectar con comanda para saber la fecha
  /*
    Lo que quiero devolver es algo:
    [
      {
        platillo: id_platillo,
        ventas_por_comanda: [
          {
            fecha_compra: fecha_compra_comanda,
            hora_compra: hora_compra_comanda,
            cantidad_ventas: cantidad_ventas
          }
        ]
      }
    ]
  
  */
  let result = []
  let outer_json = {}
  outer_json['platillo'] = platilloEncontrado.id_platillo

  let cantidadVentasPlatillos = []

  //obtiene todas las comandas asociadas al platillo
  let comandas_platillo = await AppDataSource.query(`
   SELECT c.id_comanda, cc.id_platillo, c.fecha_comanda, c.hora_comanda
   FROM comanda c
   INNER JOIN conforma_comanda cc ON cc.id_comanda = c.id_comanda
   WHERE cc.id_platillo = $1
   GROUP BY cc.id_comanda
    `, [id_platillo])
  //verificar que existan comandas asociadas al platillo
  if (!comandas_platillo || comandas_platillo.length === 0) {
    return [null, "no existen comandas asociadas"]
  }
  //cuanta la cantidad de veces que se vendio el platillo en esta comanda
  for (let i = 0; i < comandas_platillo.length; i++) {
    const comanda = comandas_platillo[i]
    dict_ventas_platillo = {}
    dict_ventas_platillo['fecha_compra'] = comanda['fecha_compra_comanda']
    dict_ventas_platillo['hora_compra'] = comanda['hora_compra_comanda']

    ventas_platillo = AppDataSource.query(`
    SELECT COUNT(1) as count 
    FROM comanda c
    INNER JOIN conforma_comanda cc ON c.id_comanda = cc.id_comanda
    WHERE c.id_comanda = $1
    `, [comandas_platillo])
    console.log(ventas_platillo)
    dict_ventas_platillo['cantidad_ventas'] = ventas_platillo['count']
    cantidadVentasPlatillos.append(dict_ventas_platillo)
  }
  outer_json['ventas_por_comanda'] = cantidadVentasPlatillos
  result.append(outer_json)
  console.log("ventas_platillo: " + result);
  return [result, null]
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