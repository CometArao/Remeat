import React from 'react';
import useComandasWithPlatillos from '../hooks/platillos/useComandasWithPlatillos';
import { confirmarPlatillo } from '../services/platillos.service';

const ConfirmaPlatillo = () => {
  const { comandas, loading, error, refetch } = useComandasWithPlatillos();

  const handleConfirmarPlatillo = async (idPlatillo, idComanda) => {
    try {
      const nuevoEstado = 'preparado';
      await confirmarPlatillo(idPlatillo, idComanda, nuevoEstado);
      alert('Platillo confirmado como preparado');
      refetch(); // Recarga las comandas actualizadas
    } catch (err) {
      console.error('Error al confirmar platillo:', err);
      alert('No se pudo confirmar el platillo. Intenta nuevamente.');
    }
  };

  if (loading) return <p>Cargando comandas...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Gestión de Platillos - Cocinero</h1>
      {comandas.length === 0 ? (
        <p>No hay comandas disponibles</p>
      ) : (
        <div className="comandas-container">
          {comandas.map((comanda) => (
            <div key={comanda.idComanda} className="comanda-item">
              <h3>Comanda ID: {comanda.idComanda}</h3>
              <p>Fecha: {comanda.fecha}</p>
              <div className="platillos-list">
                {comanda.platillos.map((platillo) => (
                  <div key={platillo.idPlatillo} className="platillo-item">
                    <p>
                      {platillo.nombrePlatillo} - Cantidad: {platillo.cantidad} - Estado: {platillo.estadoPlatillo}
                    </p>
                    {platillo.estadoPlatillo === 'pendiente' && (
                      <button
                        onClick={() => handleConfirmarPlatillo(platillo.idPlatillo, comanda.idComanda)}
                      >
                        Confirmar como preparado
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmaPlatillo;
