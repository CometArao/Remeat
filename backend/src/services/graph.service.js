"use strict";
import { AppDataSource } from "../config/configDb.js";
import Utensilio from "../entity/utensilio.entity.js"
import TipoUtensilio from "../entity/tipo_utensilio.entity.js"


export async function getUtensiliosDeTipoService(id_tipo_utensilio) { 
  const tipo_utensilioRepository = AppDataSource.getRepository(TipoUtensilio);
  const utensilioRepository = AppDataSource.getRepository(Utensilio);
  //validar que existe el tipo
  const tipoUtensilioEncontrado = await tipo_utensilioRepository.findOne({
    where: [{id_tipo_utensilio: id_tipo_utensilio}]
  })
  if(!tipoUtensilioEncontrado) {
    return [null, "No se encontro ese tipo de utensilio"]
  }
  const utensilios = await utensilioRepository.find({
    where: [{id_tipo_utensilio: id_tipo_utensilio}]
  }) 
  console.log("utensilios")
  console.log(utensilios)
  return [utensilios, null]
}

export async function getGraficoLinea(dependiente, independiente, ingrediente, platillo) {

    switch(independiente) {

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