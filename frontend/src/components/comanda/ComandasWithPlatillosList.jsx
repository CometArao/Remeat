import React from 'react';
import useGetComandasWithPlatillos from '../../hooks/comandas/useGetComandasWithPlatillos';
import '../../styles/Comandas.css';
import ComandaPlatillos from './ComandaPlatillos';

const ComandasWithPlatillosList = () => {
  const { comandasWithPlatillos, loading, error, refetch } = useGetComandasWithPlatillos();

  if (loading) return <p>Cargando comandas con platillos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  if (!comandasWithPlatillos || comandasWithPlatillos.length === 0) {
    return <p>No hay comandas con platillos disponibles.</p>;
  }

  return (
    <div className="comandas-container">
      <h2>Listado de Comandas con Platillos</h2>
      {comandasWithPlatillos.map((comanda) => (
        <div key={comanda.idComanda} className="comanda-item">
          <h3>Comanda ID: {comanda.idComanda}</h3>
          <p>Fecha: {comanda.fecha}</p>
          <p>Tiene Platillos: {comanda.tienePlatillos ? 'Sí' : 'No'}</p>
          {comanda.tienePlatillos && (
            <div className="platillos-container">
              <p>Platillos:</p>
              {Array.isArray(comanda.platillos) ? (
                comanda.platillos.map((platillo) => (
                  <div key={`${comanda.idComanda}-${platillo.idPlatillo}`} className="platillo-item">
                    <p>
                      {platillo.nombrePlatillo} - Cantidad: {platillo.cantidad} - Estado: {platillo.estadoPlatillo}
                    </p>
                    <ComandaPlatillos
                      platillos={[platillo]}
                      comandaId={comanda.idComanda}
                      onPlatilloRemoved={() => refetch()}
                    />
                  </div>
                ))
              ) : (
                <p>No se encontraron platillos.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComandasWithPlatillosList;
