"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import horario_dia from "../entity/horario_dia.entity.js";
import usuarios from "../entity/usuario.entity.js"

export async function find() {
    console.log("find function: \n");
    const usuarioRepository = AppDataSource.getRepository(usuarios)
    const Usuarios = await usuarioRepository.find({
        relations: {
            horario_laboral: true,
        },
    })
    console.log(Usuarios);
}