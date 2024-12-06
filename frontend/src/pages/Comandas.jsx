import React, { useState } from 'react';
import useGetComandas from '../hooks/comandas/useGetComandas';
import useCreateComanda from '../hooks/comandas/useCreateComanda';
import useDeleteComanda from '../hooks/comandas/useDeleteComanda';
import useGetComandasWithPlatillos from '../hooks/comandas/useGetComandasWithPlatillos'; // Hook adicional para platillos
import ComandaForm from '../components/Comanda/ComandaForm';
import ComandaList from '../components/Comanda/ComandaList';
import ComandasWithPlatillosList from '../components/Comanda/ComandasWithPlatillosList';
import '../styles/Comandas.css';

const Comandas = () => {
  const { comandas, loading, error, refetch: refetchComandas } = useGetComandas();
  const { create, loading: creating } = useCreateComanda();
  const { remove, loading: deleting } = useDeleteComanda();
  const { comandasWithPlatillos, loading: loadingPlatillos, error: errorPlatillos, refetch: refetchPlatillos } = useGetComandasWithPlatillos();
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState('default');

  const handleCreateComanda = async (comandaData) => {
    await create(comandaData);
    refetchComandas();
    setShowForm(false);
  };

  const handleDeleteComanda = async (id) => {
    try {
      await remove(id); // Llama al hook
      refetchComandas(); // Actualiza la lista de comandas
    } catch (err) {
      console.error('Error manejado en la página:', err.message || err);
      alert(err.message || 'Error inesperado al eliminar la comanda.');
    }
  };
  

  if (loading || loadingPlatillos) return <p>Cargando datos...</p>;
  if (error || errorPlatillos) return <p style={{ color: 'red' }}>Error: {error?.message || errorPlatillos?.message}</p>;

  return (
    <div className="comandas-page">
      <h1>Gestión de Comandas</h1>
      <div className="comandas-actions">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Ocultar Formulario' : 'Nueva Comanda'}
        </button>
        <button onClick={() => setView('default')}>Ver Comandas</button>
        <button onClick={() => setView('withPlatillos')}>Ver Comandas con Platillos</button>
      </div>

      {showForm && (
        <div className="comanda-form-container">
          <ComandaForm onSubmit={handleCreateComanda} />
        </div>
      )}

      {view === 'default' && (
        <ComandaList comandas={comandas} onDelete={handleDeleteComanda} />
      )}

      {view === 'withPlatillos' && (
        <ComandasWithPlatillosList comandasWithPlatillos={comandasWithPlatillos} refetch={refetchPlatillos} />
      )}

      {creating && <p>Creando comanda...</p>}
      {deleting && <p>Eliminando comanda...</p>}
    </div>
  );
};

export default Comandas;
