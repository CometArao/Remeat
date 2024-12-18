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

      // Escucha el evento 'auth' para verificar el token y rol
      socket.on("auth", (token) => {
          try {
              const user = jwt.verify(token, process.env.JWT_SECRET); // Decodifica el token
              const { id_usuario, rol_usuario } = user;

              // Adjunta el rol y el ID del usuario al socket
              socket.data.id_usuario = id_usuario;
              socket.data.rol_usuario = rol_usuario;

              console.log(`Usuario autenticado: ${id_usuario}, Rol: ${rol_usuario}`);
          } catch (err) {
              console.error("Error verificando token:", err.message);
              socket.emit("auth_error", "Token inválido o expirado");
              socket.disconnect(); // Desconecta al cliente si el token es inválido
          }
      });

      // Cuando el cliente se desconecta
      socket.on("disconnect", () => {
          console.log(`Cliente desconectado: ${socket.id}`);
      });
  });

  console.log("Servidor WebSocket inicializado.");
}

export function getSocketInstance() {
  //console.log("Obteniendo instancia de WebSocket:", io);
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
    //console.log(`Notificación enviada: ${event}`, data);
  } catch (error) {
    console.error("Error enviando notificación:", error.message);
  }
}

export function sendNotificationWithRole(event, data) {
  try {
    const io = getSocketInstance();

    // Emitir a los sockets con roles específicos
    io.sockets.sockets.forEach((socket) => {
        if (roles.includes(socket.data.rol_usuario)) {
            socket.emit(event, data);
        }
    });
} catch (error) {
    console.error("Error enviando notificación:", error.message);
}
}
