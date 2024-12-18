"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { initializeData } from "./config/initialSetup.js";
import http from "http";
import { initializeSocket } from "./services/socket.js";
import { passportJwtSetup } from "./auth/passport.auth.js"; // Importar configuración de Passport
import { verificarIngredientesBajoStock } from "../src/services/platillo.service.js"; // Importa tu servicio

async function setupServer() {
  try {
    const app = express();
    const server = http.createServer(app);

    // Inicializa WebSocket
    initializeSocket(server);

    app.disable("x-powered-by");

    // Middleware de Express
    app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    // Configurar sesión
    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      })
    );

    // Inicializar Passport y JWT
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup(); // Configuración de estrategia JWT

    // Rutas de la API
    app.use("/api", indexRoutes);

     // Se ejecuta cada 2 minutos, verificando si hay ingredientes en bajo stock
     setInterval(verificarIngredientesBajoStock, 120000);

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });

    return app;
  } catch (error) {
    console.error("Error en index.js -> setupServer(), el error es:", error);
  }
}

async function setupAPI() {
  try {
    await connectDB(); // Conectar a la base de datos
    await setupServer(); // Configurar servidor
    await initializeData(); // Crear usuarios iniciales
  } catch (error) {
    console.error("Error en index.js -> setupAPI(), el error es:", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.error("Error en index.js -> setupAPI(), el error es:", error)
  );
