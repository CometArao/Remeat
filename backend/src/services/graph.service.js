"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getGraficoLinea(dependiente, independiente, ingrediente, platillo) {

    switch(independiente) {

    }

    /*
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
      consultar pedidos
      consultar 
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
    */N
   //¿como tiene que verse en el front end?

}
export async function getCantidadIngrediente(tipo_ingrediente) {
  //revisar si existe el tipo ingrediente
  //verificar si existen ingredientes en el inventario
  //consultar por todos y sumar la cantidad (solo contar si no esta vencido)
  //retornar candidad
}
export async function getPedidosConTipoIngrediente(tipo_ingrediente) {
  //revisar si existe el tipo de ingrediente
  //verificar si existen ingredientes en pedidos
  //consultar todos los pedidos que tengan ese tipo de ingrediente
  //retornar lista de pedidos
}
export async function getComandasConTipoIngrediente(tipo_ingrediente) {
  //revisar si existe el tipo de ingrediente
  //verificar si existen comandas con ese tipo
  //consultar todas las comandas con este tipo
  //retornar lista de comandas
}
/*
 * ESTADOS: pendiente, lista_entrega, entregado
 * consultar si se puede retornar platillos.
 */

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}