import React from 'react';
import useGetComandasWithPlatillos from '../../hooks/Comandas/useGetComandasWithPlatillos';
import '../../styles/Comandas.css';

const ComandasWithPlatillosList = () => {
  const { comandasWithPlatillos, loading, error } = useGetComandasWithPlatillos();

  if (loading) return <p>Cargando comandas con platillos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  if (comandasWithPlatillos.length === 0) {
    return <p>No hay comandas con platillos disponibles.</p>;
  }

  return (
    <div className="comandas-with-platillos-container">
      <h2>Listado de Comandas con Platillos</h2>
      {comandasWithPlatillos.map((comanda) => (
        <div key={comanda.idComanda} className="comanda-with-platillos-item">
          <h3>Comanda ID: {comanda.idComanda}</h3>
          <p>Fecha: {comanda.fecha}</p>
          <p>Tiene Platillos: {comanda.tienePlatillos ? 'Sí' : 'No'}</p>
          {comanda.tienePlatillos && (
            <div>
              <h4>Platillos:</h4>
              <ul>
                <li>Nombre: {comanda.nombrePlatillo || 'No especificado'}</li>
                <li>Cantidad: {comanda.cantidad || 0}</li>
                <li>Estado: {comanda.estadoPlatillo || 'Desconocido'}</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComandasWithPlatillosList;
