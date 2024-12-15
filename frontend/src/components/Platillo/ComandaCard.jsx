import React from "react";
import "../../styles/confirmarPlatillo.css"; // Usamos el CSS correspondiente.

const ComandaCard = ({ comanda, onConfirm }) => {
  return (
    <div className="platillo-card">
      <h2>Comanda ID: {comanda.idComanda}</h2>
      <p>Fecha: {comanda.fecha}</p>
      <div className="platillos-list">
        {comanda.platillos.map((platillo) => (
          <div key={platillo.idPlatillo}>
            <h4>{platillo.nombrePlatillo}</h4>
            <p>Cantidad: {platillo.cantidad}</p>
            <span
              className={
                platillo.estadoPlatillo === "pendiente"
                  ? "status-unavailable"
                  : "status-available"
              }
            >
              {platillo.estadoPlatillo === "pendiente" ? "Pendiente" : "Preparado"}
            </span>
            <button
              className="confirm-button"
              onClick={() => onConfirm(platillo.idPlatillo, comanda.idComanda)}
            >
              Confirmar como preparado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComandaCard;
