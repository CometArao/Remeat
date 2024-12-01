import React from 'react';
import useGetComandas from '../../hooks/comandas/useGetComandas';
import ComandaItem from './ComandaItem';

const ComandaList = () => {
  const { comandas, loading, error } = useGetComandas();

  if (loading) {
    return <p>Cargando comandas...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error al cargar comandas: {error.message}</p>;
  }

  if (!comandas.length) {
    return <p>No se encontraron comandas.</p>;
  }

  return (
    <ul>
      {comandas.map((comanda) => (
        <ComandaItem key={comanda.id_comanda} comanda={comanda} />
      ))}
    </ul>
  );
};

export default ComandaList;
