"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getGraficoLinea(dependiente, independiente, ingrediente, platillo) {

    switch(independiente) {

    }

    /*
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
   //como tiene que verse en el front end

}

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