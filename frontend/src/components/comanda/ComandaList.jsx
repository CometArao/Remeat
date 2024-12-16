import React, { useState, useEffect } from 'react';
import ComandaItem from './ComandaItem';
import useGetComandas from '../../hooks/comandas/useGetComandas';
import ComandaDetail from './ComandaDetail';
import socket from '../../services/socket.js'; 
import { showInfoAlert } from '../../helpers/sweetAlert.js'; 

const ComandaList = () => {
  const { comandas, loading, error, refetch } = useGetComandas();
  const [filteredComanda, setFilteredComanda] = useState(null);

 
  useEffect(() => {
    socket.on('nueva-comanda', (data) => {
      console.log('Nueva comanda recibida:', data);
      showInfoAlert('¡Nueva Comanda!', `ID de la comanda: ${data.id_comanda} ha sido creada.`);
      refetch(); 
    });

    
    return () => {
      socket.off('nueva-comanda');
    };
  }, [refetch]);

  const handleSearchComplete = (comanda) => {
    setFilteredComanda(comanda); 
  };

  const handleClearSearch = () => {
    setFilteredComanda(null); 
  };

  const handleDelete = async () => {
    console.log('Eliminando una comanda...');
    await refetch();
  };

  const handleComplete = async () => {
    console.log('Completando una comanda...');
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

      {/* Integrar ComandaDetail */}
      <ComandaDetail
        onSearchComplete={handleSearchComplete}
        onClearSearch={handleClearSearch}
      />

      {/* Mostrar lista de comandas o resultados filtrados */}
      {filteredComanda ? (
        <div>
          <ComandaItem
            key={filteredComanda.id_comanda}
            comanda={filteredComanda}
            onDelete={handleDelete}
            onComplete={handleComplete}
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
