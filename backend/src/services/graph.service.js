"use strict";
import { AppDataSource, connectDB } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js"
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"
import Platillo from "../entity/platillo.entity.js"
import Comanda from "../entity/comanda.entity.js"

/* 
Dada una lista de ids devuelve la cantidad vigente en el sistema
de utensilios, para esto descuenta la cantidad de mermas y agrega la 
cantidad de pedidos
*/
export async function getUtensiliosDeTipoService(ids_tipos_utensilio) {
  /*
  respuesta:
  {
    utensilios: [ 
      id_utensilio [
        {
          fecha: {fecha actual},
          cantidad_utensilios: {cantidad_utensilios}
        },
        ...
      ]
    ]
  } 
  
  */
  const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
  result = [];
  for (let i = 0; i < ids_tipos_utensilio.length; i++) {
    const id_tipo_utensilio = ids_tipos_utensilio[i];
    const tipoUtensilioEncontrado = await tipo_utensilioRepository.findOne({
      where: {id_tipo_utensilio : id_tipo_utensilio}
    })
    if(!tipoUtensilioEncontrado) {
      //No importa si el resto de las ids no se ve porque en el front end este error no deberia ser posible. 
      //Es solo si alguien esta accediendo a las urls directamente posiblemente intentando una inyeccion sql
      return [null, "El utensilio de id: " + id_tipo_utensilio + " no existe"]
    }

    //Se usa "" en una columna cuando el nombre de esa columna tiene que ser *case-sensitive*
    AppDataSource.query(`
      SELECT *
      FROM tipo_utensilio tu
      INNER JOIN utensilio u ON u.id_tipo_utensilio = tu.id_tipo_utensilio 
      INNER JOIN compuesto_utensilio cu ON cu.id_utensilio = u.id_utensilio
      INNER JOIN pedido p ON p.id_pedido = cu.id_pedido
      INNER JOIN utensilio_merma_merma um ON um."utensilioIdUtensilio" = u.id_utensilio
      INNER JOIN merma m ON um."mermaIdMerma" = m.id_merma
      WHERE tu.id_tipo_utensilio = $1;
      ORDER BY 
      `, [{id_tipo_utensilio}])
      par_cantidad_fecha = {}
      //Creo que tiene mas sentido consultar los utensilios, despues consultar separadamente los pedidos y las mermas
      const utensilios = AppDataSource.query(`
      SELECT *
      FROM tipo_utensilio tu
      INNER JOIN utensilio u ON u.id_tipo_utensilio = tu.id_tipo_utensilio 
      INNER JOIN compuesto_utensilio cu ON cu.id_utensilio = u.id_utensilio
      INNER JOIN pedido p ON p.id_pedido = cu.id_pedido
      WHERE tu.id_tipo_utensilio = $1;
      ORDER BY p.fecha_entrega_pedido ASC
      `, [{id_tipo_utensilio}])
      console.log(utensilios)
      //TODO: se usa fecha entrega o fecha compra
      //por cada utensilio restarle las mermas a la cantidad
      /*
        Para cada utensilio contar su cantidad menos las mermas de ese ingrediente. Contar por fechas, cada vez que se usa 
      */
      
  }

  return [utensilios, null]
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
      ventasPlatillo['ventas'] = platillo_comanda['count']
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

      dict_ventas_platillo['cantidad_ventas'] = ventas_platillo_result[0].count;
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
`
SELECT *
FROM comanda c
INNER JOIN conforma comanda cc
INNER JOIN platillo p
INNER JOIN tipo_ingrediente ti
INNER JOIN 

`