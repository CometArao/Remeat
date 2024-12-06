import React from 'react';
import ComandaItem from './ComandaItem';
import useGetComandas from '../../hooks/Comandas/useGetComandas';

const ComandaList = () => {
  const { comandas, loading, error, refetch } = useGetComandas();

  const handleDelete = async () => {
    await refetch(); // Recargar lista después de eliminar
  };

  const handleComplete = async () => {
    await refetch(); // Recargar lista después de completar
  };

  if (loading) return <p>Cargando comandas...</p>;
  if (error) return <p>Error al cargar las comandas: {error.message}</p>;

  return (
    <div className="comandas-container">
      <h2>Listado de Comandas</h2>
      {comandas.length > 0 ? (
        comandas.map((comanda) => (
          <ComandaItem
            key={comanda.id_comanda}
            comanda={comanda}
            onDelete={handleDelete}
            onComplete={handleComplete} // Pasa la función para manejar completados
          />
        ))
      ) : (
        <p>No hay comandas disponibles.</p>
      )}
    </div>
  );
};

export default ComandaList;
