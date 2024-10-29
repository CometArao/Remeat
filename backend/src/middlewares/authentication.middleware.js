"use strict";
import passport from "passport";
import { isTokenBlacklisted } from "../utils/tokenBlacklist.js"; // Importa la función
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return handleErrorServer(res, 500, "Error de autenticación en el servidor");
    }

    const token = req.headers.authorization?.split(" ")[1];

    // Verifica si el token está en la lista negra
    if (token && isTokenBlacklisted(token)) {
      return handleErrorClient(res, 401, "Token inválido o expirado. Por favor, inicia sesión nuevamente.");
    }

    if (!user) {
      return handleErrorClient(res, 401, "No tienes permiso para acceder a este recurso", 
        { info: info ? info.message : "No se encontró el usuario" });
    }

    req.user = user;
    next();
  })(req, res, next);
}
