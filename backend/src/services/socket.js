import { Server } from "socket.io";

let io; // Mantendremos el objeto de socket.io global para enviar eventos más adelante

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Cambia esto según el dominio permitido
    },
  });

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Evento para desconexión
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  console.log("Servidor WebSocket inicializado.");
}

export function sendNotification(event, data) {
  if (io) {
    io.emit(event, data); // Envía el evento a todos los clientes conectados
    console.log(`Notificación enviada: ${event}`, data);
  } else {
    console.error("WebSocket no está inicializado.");
  }
}
