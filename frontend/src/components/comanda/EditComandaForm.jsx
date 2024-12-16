import React, { useState } from 'react';
import useUpdateComanda from '../../hooks/comandas/useUpdateComanda';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

const EditComandaForm = ({ comanda, onEditComplete }) => {
  const [fechaCompra, setFechaCompra] = useState(comanda.fecha_compra_comanda);
  const [horaCompra, setHoraCompra] = useState(comanda.hora_compra_comanda);
  const { update, loading } = useUpdateComanda();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      fecha_compra_comanda: fechaCompra,
      hora_compra_comanda: horaCompra,
      estado_comanda: comanda.estado_comanda, // Mantén el estado existente
    };

    try {
      await update(comanda.id_comanda, updatedData);
      showSuccessAlert('¡Actualizado!', 'Comanda actualizada correctamente.');
      if (onEditComplete) onEditComplete();
    } catch (err) {
      showErrorAlert('Error', 'No se pudo actualizar la comanda.');
      console.error('Error al actualizar la comanda:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Fecha de Compra:
        <input
          type="date"
          value={fechaCompra}
          onChange={(e) => setFechaCompra(e.target.value)}
          required
        />
      </label>
      <label>
        Hora de Compra:
        <input
          type="time"
          value={horaCompra}
          onChange={(e) => setHoraCompra(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
};

export default EditComandaForm;
