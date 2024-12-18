import React, { useCallback } from 'react';
import useGetComandasWithPlatillos from '../../hooks/comandas/useGetComandasWithPlatillos'; // Hook para obtener comandas con platillos
import DeleteComandaPlatillos from './DeleteComandaPlatillos'; // Importamos el componente para eliminar platillos

const ComandasWithPlatillosList = () => {
  const { comandasWithPlatillos, loading, error, refetch } = useGetComandasWithPlatillos();

  const handleRefetch = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

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
                  <div key={platillo.idPlatillo} className="platillo-item">
                    <p>
                      ID Platillo: {platillo.idPlatillo} <br />
                      Nombre: {platillo.nombrePlatillo} <br />
                      Cantidad: {platillo.cantidad} <br />
                      Estado: {platillo.estadoPlatillo}
                    </p>
                    {/* Integramos DeleteComandaPlatillos para eliminar */}
                    <DeleteComandaPlatillos
                      platillos={[platillo]} // Pasar el platillo actual
                      comandaId={comanda.idComanda} // ID de la comanda
                      onPlatilloRemoved={handleRefetch} // Actualizar al eliminar
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
