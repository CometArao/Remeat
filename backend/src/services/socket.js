import { Server } from "socket.io";

let io = null;

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // Permitir conexiones desde cualquier origen
        },
    });

    io.on("connection", (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    console.log("Servidor WebSocket inicializado.");
}

export function getSocketInstance() {
  console.log("Obteniendo instancia de WebSocket:", io);
    if (!io) {
        throw new Error("WebSocket no inicializado. Asegúrate de llamar a initializeSocket.");
    }
    return io;
}


// Función para enviar notificaciones
export function sendNotification(event, data) {
  try {
    const io = getSocketInstance(); // Obtiene la instancia de Socket.IO
    io.emit(event, data); // Emite el evento y los datos
    console.log(`Notificación enviada: ${event}`, data);
  } catch (error) {
    console.error("Error enviando notificación:", error.message);
  }
}
