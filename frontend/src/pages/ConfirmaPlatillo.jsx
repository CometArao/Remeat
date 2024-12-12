import React from 'react';
import useComandasWithPlatillos from '../hooks/platillos/useComandasWithPlatillos';
import { confirmarPlatillo } from '../services/platillos.service';
import '@styles/confirmarPlatillo.css'; // Asegúrate de tener estilos en este archivo

const PlatilloCard = ({ platillo, onConfirm }) => (
  <div className="platillo-card">
    <h2>{platillo.nombrePlatillo}</h2>
    <h4>Cantidad: {platillo.cantidad}</h4>
    <span className={`status-${platillo.estadoPlatillo}`}>
      {platillo.estadoPlatillo === 'pendiente' ? 'Pendiente' : 'Preparado'}
    </span>
    <button className="confirm-button" onClick={onConfirm}>
      Confirmar como preparado
    </button>
  </div>
);

const ComandaItem = ({ comanda, onConfirm }) => (
  <div className="comanda-item">
    <h3>Comanda ID: {comanda.idComanda}</h3>
    <p>Fecha: {comanda.fecha}</p>
    <div className="platillos-list">
      {comanda.platillos.map((platillo) => (
        <PlatilloCard
          key={platillo.idPlatillo}
          platillo={platillo}
          onConfirm={() => onConfirm(platillo.idPlatillo, comanda.idComanda)}
        />
      ))}
    </div>
  </div>
);

const ConfirmaPlatillo = () => {
  const { comandas, loading, error, refetch } = useComandasWithPlatillos();

  const handleConfirmarPlatillo = async (idPlatillo, idComanda) => {
    try {
      const nuevoEstado = 'preparado';
      await confirmarPlatillo(idPlatillo, idComanda, nuevoEstado);
      alert('Platillo confirmado como preparado'); // Cambiar a toast en producción
      refetch();
    } catch (err) {
      console.error('Error al confirmar platillo:', err);
      alert('No se pudo confirmar el platillo. Intenta nuevamente.');
    }
  };

  if (loading) return <p className="loading">Cargando comandas...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h1>Gestión de Platillos - Cocinero</h1>
      {comandas.length === 0 ? (
        <p>No hay comandas disponibles</p>
      ) : (
        comandas.map((comanda) => (
          <ComandaItem key={comanda.idComanda} comanda={comanda} onConfirm={handleConfirmarPlatillo} />
        ))
      )}
    </div>
  );
};

export default ConfirmaPlatillo;