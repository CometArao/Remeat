import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Asegúrate de que la URL sea correcta

socket.on("connect", () => {
    console.log("Conectado al servidor WebSocket");
});

socket.on("platillo-actualizado", (data) => {
  console.log("Notificación recibida:", data);
  alert(`El platillo con ID ${data.id_platillo} está en estado "${data.nuevo_estado}"`);
});


socket.on("disconnect", () => {
    console.log("Desconectado del servidor WebSocket");
});
export default socket;