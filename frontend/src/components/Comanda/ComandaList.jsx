import React from 'react';
import useDeleteComanda from '../../hooks/Comandas/useDeleteComanda'; // Hook para eliminar comandas
import '../../styles/Comandas.css';

const ComandaList = ({ comandas, onDelete }) => {
  const { remove, loading: deleting } = useDeleteComanda(); // Hook para manejar la eliminación de comandas

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar la comanda con ID ${id}?`)) {
      await remove(id);
      onDelete(); // Notifica al componente padre para refrescar el listado
    }
  };

  return (
    <div className="comandas-container">
      <h2>Listado de Comandas</h2>
      {comandas.map((comanda) => (
        <div key={comanda.id_comanda} className="comanda-item">
          <h3>Comanda ID: {comanda.id_comanda}</h3>
          <p>Fecha: {comanda.fecha_compra_comanda}</p>
          <p>Hora: {comanda.hora_compra_comanda}</p>
          <p>Estado: <strong>{comanda.estado_comanda}</strong></p> {/* Estado añadido */}
          <button onClick={() => handleDelete(comanda.id_comanda)} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ComandaList;
