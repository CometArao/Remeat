import React, { useState } from 'react';
import DeleteComanda from './DeleteComanda';
import AddPlatilloForm from './AddPlatilloForm';
import CompleteComandaButton from './CompleteComandaButton';
import EditComandaForm from './EditComandaForm'; // Importar el formulario de edición

const ComandaItem = ({ comanda, onDelete, onComplete, onEditComplete }) => {
  const [showAddPlatillo, setShowAddPlatillo] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // Estado para mostrar/ocultar formulario de edición

  return (
    <div className="comanda-item">
      <h3>Comanda ID: {comanda.id_comanda}</h3>
      <p>Fecha: {comanda.fecha_compra_comanda}</p>
      <p>Hora: {comanda.hora_compra_comanda}</p>
      <p>Estado: <strong>{comanda.estado_comanda}</strong></p>

      {/* Botón para eliminar */}
      <DeleteComanda comandaId={comanda.id_comanda} onDelete={onDelete} />
      
      {/* Botón para completar */}
      <CompleteComandaButton comandaId={comanda.id_comanda} onComplete={onComplete} />
      
      {/* Botón para editar */}
      <button onClick={() => setShowEditForm(!showEditForm)}>
        {showEditForm ? 'Cancelar Edición' : 'Editar Comanda'}
      </button>

      {/* Mostrar formulario de edición si está habilitado */}
      {showEditForm && (
        <EditComandaForm
          comanda={comanda}
          onEditComplete={() => {
            setShowEditForm(false); // Oculta el formulario tras editar
            if (onEditComplete) onEditComplete();
          }}
        />
      )}

      {/* Botón para añadir platillo */}
      <button onClick={() => setShowAddPlatillo(!showAddPlatillo)}>
        {showAddPlatillo ? 'Cancelar' : 'Añadir Platillo'}
      </button>

      {showAddPlatillo && <AddPlatilloForm comandaId={comanda.id_comanda} />}
    </div>
  );
};

export default ComandaItem;
