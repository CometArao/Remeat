import React, { useEffect } from "react";
import useComandasWithPlatillos from "../hooks/platillos/useComandasWithPlatillos";
import { confirmarPlatillo } from "../services/platillos.service";
import ComandaCard from "../components/Platillo/ComandaCard"; // Tarjeta de comanda
import "@styles/confirmarPlatillo.css"; // Estilos existentes.
import socket from "../services/socket"; // Importar WebSocket

const ConfirmaPlatillo = () => {
  const { comandas, loading, error, refetch } = useComandasWithPlatillos();

  const handleConfirmarPlatillo = async (idPlatillo, idComanda) => {
    try {
      const nuevoEstado = "preparado";
      await confirmarPlatillo(idPlatillo, idComanda, nuevoEstado);
      
      refetch(); // Refresca las comandas después de la confirmación
    } catch (err) {
      console.error("Error al confirmar platillo:", err);
      alert("No se pudo confirmar el platillo. Intenta nuevamente.");
    }
  };

  // Escuchar notificaciones de WebSocket
  useEffect(() => {
    socket.on("platillo_actualizado", (data) => {
      console.log("Notificación recibida:", data);
      alert(`Notificación: ${data.mensaje}`); // Muestra una alerta con la notificación
      refetch(); // Actualiza las comandas al recibir una notificación
    });

    // Limpiar evento al desmontar el componente
    return () => {
      socket.off("platillo_actualizado");
    };
  }, [refetch]); // Dependencia de refetch para evitar problemas de actualización

  if (loading) return <p className="loading">Cargando comandas...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <div>
        <h1 className="title">Comandas con Platillos</h1>
        {comandas.length === 0 ? (
          <p>No hay comandas disponibles</p>
        ) : (
          comandas.map((comanda) => (
            <ComandaCard
              key={comanda.idComanda}
              comanda={comanda}
              onConfirm={handleConfirmarPlatillo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConfirmaPlatillo;
