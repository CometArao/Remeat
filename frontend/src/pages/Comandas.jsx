import React, { useState } from 'react';
import useGetComandas from '../hooks/comandas/useGetComandas';
import useCreateComanda from '../hooks/comandas/useCreateComanda';
import useDeleteComanda from '../hooks/comandas/useDeleteComanda';
import ComandaForm from '../components/Comanda/ComandaForm';
import ComandaList from '../components/Comanda/ComandaList';

const Comandas = () => {
  const { comandas, loading, error } = useGetComandas();
  const { create, loading: creating } = useCreateComanda();
  const { remove, loading: deleting } = useDeleteComanda();
  const [showForm, setShowForm] = useState(false);

  const handleCreateComanda = async (comandaData) => {
    await create(comandaData);
    window.location.reload(); // Refresca el listado
  };

  const handleDeleteComanda = async (id) => {
    await remove(id);
    window.location.reload(); // Refresca el listado
  };

  if (loading) return <p>Cargando comandas...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <div>
      <h1>Comandas</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar Formulario' : 'Nueva Comanda'}
      </button>
      {showForm && <ComandaForm onSubmit={handleCreateComanda} />}
      {creating && <p>Creando comanda...</p>}
      <ComandaList comandas={comandas} onDelete={handleDeleteComanda} />
      {deleting && <p>Eliminando comanda...</p>}
    </div>
  );
};

export default Comandas;
