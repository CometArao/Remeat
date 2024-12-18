import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Asegúrate de que la URL sea correcta

socket.on("connect", () => {
    console.log("Conectado al servidor WebSocket");
});

socket.on("platillo-actualizado", (data) => {
  console.log("Notificación recibida:", data);
  alert(`El platillo con ID ${data.id_platillo} está en estado "${data.nuevo_estado}"`);
});

// Escuchar notificaciones de ingredientes en bajo stock
socket.on("ingrediente-bajo-stock", (data) => {
  console.log("Notificación de bajo stock recibida:", data);
  alert(`Ingrediente en bajo stock: ${data.tipo_ingrediente}\nCantidad actual: ${data.cantidad_actual}`);
});


socket.on("disconnect", () => {
    console.log("Desconectado del servidor WebSocket");
});



socket.on("nueva-comanda", (data) => {
  console.log("Nueva comanda recibida:", data);
  alert(`Nueva comanda creada con ID ${data.id_comanda}. Lista para preparar.`);
});

export default socket;