import React, { useState } from 'react';
import useDeleteComanda from '../../hooks/Comandas/useDeleteComanda';
import AddPlatilloForm from './AddPlatilloForm'; // Importamos AddPlatilloForm
import '../../styles/Comandas.css';

const ComandaList = ({ comandas, onDelete }) => {
  const { remove, loading: deleting } = useDeleteComanda();
  const [showAddPlatillo, setShowAddPlatillo] = useState(null); // Para controlar qué comanda muestra el formulario

  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar la comanda con ID ${id}?`)) {
      await remove(id);
      onDelete(); // Refresca la lista en el padre
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
          <p>Estado: <strong>{comanda.estado_comanda}</strong></p>

          {/* Botón para eliminar comanda */}
          <button onClick={() => handleDelete(comanda.id_comanda)} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>

          {/* Botón para mostrar/ocultar AddPlatilloForm */}
          <button onClick={() => setShowAddPlatillo(showAddPlatillo === comanda.id_comanda ? null : comanda.id_comanda)}>
            {showAddPlatillo === comanda.id_comanda ? 'Cancelar' : 'Añadir Platillo'}
          </button>

          {/* Mostrar AddPlatilloForm si corresponde */}
          {showAddPlatillo === comanda.id_comanda && (
            <AddPlatilloForm comandaId={comanda.id_comanda} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ComandaList;
