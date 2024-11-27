import React from 'react';
import useGetComandas from '../hooks/comandas/useGetComandas';
import useCreateComanda from '../hooks/comandas/useCreateComanda';
import useDeleteComanda from '../hooks/comandas/useDeleteComanda';
import ComandaForm from '../components/Comanda/ComandaForm';
import ComandaList from '../components/Comanda/ComandaList';

const Comandas = () => {
  const comandas = useGetComandas();
  const { create, loading: creating } = useCreateComanda();
  const { remove, loading: deleting } = useDeleteComanda();

  const handleCreateComanda = async (comandaData) => {
    await create(comandaData);
  };

  const handleDeleteComanda = async (id) => {
    await remove(id);
  };

  return (
    <div>
      <h1>Comandas</h1>
      <ComandaForm onSubmit={handleCreateComanda} />
      {creating && <p>Creando comanda...</p>}
      <ComandaList comandas={comandas} onDelete={handleDeleteComanda} />
      {deleting && <p>Eliminando comanda...</p>}
    </div>
  );
};

export default Comandas;
