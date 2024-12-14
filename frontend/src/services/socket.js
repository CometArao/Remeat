import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Cambia el URL según tu servidor

// Escuchar notificaciones de estado de platillos
socket.on("platillo_actualizado", (data) => {
  console.log("Notificación recibida:", data);
  // Aquí puedes agregar lógica para actualizar la UI
});

export default socket;