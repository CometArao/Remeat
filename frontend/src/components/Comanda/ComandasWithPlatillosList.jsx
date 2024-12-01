import React, { useEffect, useState } from 'react';
import useGetComandasWithPlatillos from '../../hooks/Comandas/useGetComandasWithPlatillos'; // Hook para obtener comandas con platillos
import '../../styles/Comandas.css';

const ComandasWithPlatillosList = () => {
  const { comandasWithPlatillos, loading, error } = useGetComandasWithPlatillos();

  if (loading) return <p>Cargando comandas con platillos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <div className="comandas-with-platillos-container">
      <h2>Listado de Comandas con Platillos</h2>
      {comandasWithPlatillos.map((comanda) => (
        <div key={comanda.idComanda} className="comanda-with-platillos-item">
          <h3>Comanda ID: {comanda.idComanda}</h3>
          <p>Fecha: {comanda.fecha}</p>
          <p>Tiene Platillos: {comanda.tienePlatillos ? 'Sí' : 'No'}</p>
          <div>
            {comanda.platillos.map((platillo) => (
              <p key={platillo.idPlatillo}>
                {platillo.nombrePlatillo} - Cantidad: {platillo.cantidad}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComandasWithPlatillosList;
