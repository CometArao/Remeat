import React, { useState } from 'react';
import useGetComandas from '../hooks/comandas/useGetComandas';
import useCreateComanda from '../hooks/comandas/useCreateComanda';
import useDeleteComanda from '../hooks/comandas/useDeleteComanda';
import useGetComandasWithPlatillos from '../hooks/comandas/useGetComandasWithPlatillos'; // Nueva hook para platillos
import ComandaForm from '../components/Comanda/ComandaForm';
import ComandaList from '../components/Comanda/ComandaList';
import ComandasWithPlatillosList from '../components/Comanda/ComandasWithPlatillosList';
import '../styles/Comandas.css';

const Comandas = () => {
  const { comandas, loading, error, refetch: refetchComandas } = useGetComandas(); // Hook para listar comandas
  const { create, loading: creating } = useCreateComanda(); // Hook para crear comandas
  const { remove, loading: deleting } = useDeleteComanda(); // Hook para eliminar comandas
  const { comandasWithPlatillos, loading: loadingPlatillos, error: errorPlatillos, refetch: refetchPlatillos } = useGetComandasWithPlatillos(); // Hook para comandas con platillos
  const [showForm, setShowForm] = useState(false); // Controla si el formulario está visible
  const [view, setView] = useState('default'); // 'default' para comandas normales, 'withPlatillos' para comandas con platillos

  const handleCreateComanda = async (comandaData) => {
    await create(comandaData);
    refetchComandas(); // Refresca la lista tras crear
    setShowForm(false); // Oculta el formulario
  };

  const handleDeleteComanda = async (id) => {
    await remove(id);
    refetchComandas(); // Refresca la lista tras eliminar
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
        <ComandaList
          comandas={comandas}
          onDelete={handleDeleteComanda} // Refresca la lista tras eliminar
        />
      )}

      {view === 'withPlatillos' && (
        <ComandasWithPlatillosList
          comandasWithPlatillos={comandasWithPlatillos}
          refetch={refetchPlatillos} // Refresca la lista de comandas con platillos
        />
      )}

      {creating && <p>Creando comanda...</p>}
      {deleting && <p>Eliminando comanda...</p>}
    </div>
  );
};

export default Comandas;
