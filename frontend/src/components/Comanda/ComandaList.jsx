import React, { useState } from 'react';
import ComandaItem from './ComandaItem';
import useGetComandas from '../../hooks/Comandas/useGetComandas';
import useGetComandaById from '../../hooks/Comandas/useGetComandaById';

const ComandaList = () => {
  const { comandas, loading, error, refetch } = useGetComandas();
  const { comanda, loading: loadingById, error: errorById, fetchComanda } = useGetComandaById();

  const [searchId, setSearchId] = useState(''); 
  const [filteredComanda, setFilteredComanda] = useState(null); 

  const handleSearch = async () => {
    if (!searchId) return; 
    try {
      await fetchComanda(searchId); 
      setFilteredComanda(comanda); 
    } catch (e) {
      console.error('Error buscando comanda:', e.message || e);
      setFilteredComanda(null); 
    }
  };

  const handleClearSearch = () => {
    setSearchId(''); 
    setFilteredComanda(null); 
  };

  const handleDelete = async () => {
    await refetch(); 
  };

  const handleComplete = async () => {
    await refetch(); 
  };

  const handleEditComplete = async () => {
    console.log('Editando una comanda...');
    await refetch(); 
  };

  const handleCustomAction = async (comandaId) => {
    console.log(`Ejecutando acción personalizada para comanda ${comandaId}`);
    await refetch(); 
  };

  if (loading) return <p>Cargando comandas...</p>;
  if (error) return <p>Error al cargar las comandas: {error.message}</p>;

  return (
    <div className="comandas-container">
      <h2>Listado de Comandas</h2>

      {/* Buscador de comanda por ID */}
      <div className="search-container">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Buscar comanda por ID"
        />
        <button onClick={handleSearch} disabled={loadingById}>
          {loadingById ? 'Buscando...' : 'Buscar'}
        </button>
        <button onClick={handleClearSearch} disabled={loadingById}>
          Limpiar
        </button>
        {errorById && <p>Error buscando comanda: {errorById}</p>}
      </div>

      {/* Mostrar resultado de búsqueda */}
      {filteredComanda ? (
        <div>
          <h3>Resultado de la Búsqueda:</h3>
          <ComandaItem
            key={filteredComanda.data.id_comanda}
            comanda={filteredComanda.data}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onEditComplete={handleEditComplete}
            onCustomAction={handleCustomAction}
          />
        </div>
      ) : (
        <div>
          {comandas.length > 0 ? (
            comandas.map((comanda) => (
              <ComandaItem
                key={comanda.id_comanda}
                comanda={comanda}
                onDelete={handleDelete}
                onComplete={handleComplete}
                onEditComplete={handleEditComplete}
                onCustomAction={handleCustomAction}
              />
            ))
          ) : (
            <p>No hay comandas disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComandaList;
