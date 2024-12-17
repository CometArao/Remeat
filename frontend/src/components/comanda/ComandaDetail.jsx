import React, { useState } from 'react';
import useGetComandaById from '../../hooks/comandas/useGetComandaById';


const ComandaDetail = ({ onClearSearch, onSearchComplete }) => {
  const { fetchComanda, loading, error } = useGetComandaById();
  const [searchId, setSearchId] = useState('');

  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const comandaData = await fetchComanda(searchId); // Espera el resultado directamente
      if (comandaData && onSearchComplete) {
        onSearchComplete(comandaData); // Pasa los datos válidos
      }
    } catch (e) {
      console.error('Error buscando comanda:', e.message || e);
      if (onSearchComplete) onSearchComplete(null);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    if (onClearSearch) onClearSearch();
  };

  return (
    <div className="search-container">
      <input
        className='comanda-input'
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Buscar comanda por ID"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      <button onClick={handleClearSearch} disabled={loading}>
        Limpiar
      </button>
      {error && <p>Error buscando comanda: {error}</p>}
    </div>
  );
};

export default ComandaDetail;
