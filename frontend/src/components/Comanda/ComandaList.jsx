import React from 'react';
import ComandaItem from './ComandaItem';
import useGetComandas from '../../hooks/Comandas/useGetComandas';

const ComandaList = () => {
  const { comandas, loading, error, refetch } = useGetComandas();

  // Manejadores existentes
  const handleDelete = async () => {
    await refetch(); // Recarga lista tras eliminar
  };

  const handleComplete = async () => {
    await refetch(); // Recarga lista tras completar
  };

  const handleEditComplete = async () => {
    await refetch(); // Recarga lista tras editar
  };

  const handleCustomAction = async () => {
    console.log('Ejecutando acción personalizada'); // Mantén cualquier lógica adicional
    await refetch(); // Refrescar lista si necesario
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
            onDelete={handleDelete} // Mantener interacción con "Eliminar"
            onComplete={handleComplete} // Mantener interacción con "Completar"
            onEditComplete={handleEditComplete} // Añadir interacción para "Editar"
            onCustomAction={handleCustomAction} // Cualquier otra acción requerida
          />
        ))
      ) : (
        <p>No hay comandas disponibles.</p>
      )}
    </div>
  );
};

export default ComandaList;
