import React from 'react';
import useGetComandasWithPlatillos from '../../hooks/Comandas/useGetComandasWithPlatillos'; // Hook para obtener comandas con platillos
import '../../styles/Comandas.css';

const ComandasWithPlatillosList = () => {
  const { comandasWithPlatillos, loading, error } = useGetComandasWithPlatillos();

  console.log('Datos de comandas con platillos:', comandasWithPlatillos);

  if (loading) return <p>Cargando comandas con platillos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  if (!comandasWithPlatillos || comandasWithPlatillos.length === 0) {
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
              <p>Platillos:</p>
              {Array.isArray(comanda.platillos) ? (
                comanda.platillos.map((platillo, index) => (
                  <p key={index}>
                    {platillo.nombrePlatillo} - Cantidad: {platillo.cantidad} - Estado: {platillo.estadoPlatillo}
                  </p>
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
