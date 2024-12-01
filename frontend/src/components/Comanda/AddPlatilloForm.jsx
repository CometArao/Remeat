import React, { useState } from 'react';
import useAddPlatilloToComanda from '../../hooks/Comandas/useAddPlatilloToComanda';

const AddPlatilloForm = ({ comandaId }) => {
  const { addPlatillo, loading, error } = useAddPlatilloToComanda();
  const [platilloData, setPlatilloData] = useState({
    id_platillo: '',
    cantidad: '',
    estado: 'pendiente', // Valor por defecto
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPlatillo(comandaId, platilloData);
    setPlatilloData({ id_platillo: '', cantidad: '', estado: 'pendiente' }); // Limpiar formulario
  };

  return (
    <form onSubmit={handleSubmit} className="add-platillo-form">
      <h4>Añadir Platillo a Comanda</h4>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <div>
        <label>ID Platillo:</label>
        <input
          type="text"
          value={platilloData.id_platillo}
          onChange={(e) => setPlatilloData({ ...platilloData, id_platillo: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          value={platilloData.cantidad}
          onChange={(e) => setPlatilloData({ ...platilloData, cantidad: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Estado:</label>
        <select
          value={platilloData.estado}
          onChange={(e) => setPlatilloData({ ...platilloData, estado: e.target.value })}
          required
        >
          <option value="pendiente">Pendiente</option>
          <option value="preparando">Preparando</option>
          <option value="completado">Completado</option>
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir'}
      </button>
    </form>
  );
};

export default AddPlatilloForm;
