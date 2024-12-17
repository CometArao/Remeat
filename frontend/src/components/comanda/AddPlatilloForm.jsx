import React, { useEffect, useState } from 'react';
import useAddPlatilloToComanda from '../../hooks/comandas/useAddPlatilloToComanda';
import '@styles/Comandas.css';

const AddPlatilloForm = ({ comandaId }) => {
  const { addPlatillo, platillos, refetchPlatillos, loading, error } = useAddPlatilloToComanda();
  const [platilloData, setPlatilloData] = useState({
    nombre_platillo: '',
    cantidad: '',
    estado: 'pendiente', // Valor por defecto
  });

  // Cargar platillos del menú del día al montar el componente
  useEffect(() => {
    refetchPlatillos();
  }, [refetchPlatillos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formatear los datos para enviar al backend
    const formattedData = {
      nombre_platillo: platilloData.nombre_platillo, // Enviar el nombre del platillo
      cantidad: parseInt(platilloData.cantidad, 10), // Convertir a número entero
      estado: platilloData.estado, // Mantener como string
    };

    try {
      await addPlatillo(comandaId, formattedData);
      setPlatilloData({ nombre_platillo: '', cantidad: '', estado: 'pendiente' }); // Limpiar formulario
    } catch (error) {
      console.error('Error al añadir platillo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-platillo-form">
      <h4>Añadir Platillo a Comanda</h4>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <div>
        <label>Platillo:</label>
        <select
          value={platilloData.nombre_platillo}
          onChange={(e) => setPlatilloData({ ...platilloData, nombre_platillo: e.target.value })}
          required
        >
          <option value="" disabled>Seleccione un platillo</option>
          {platillos.map((platillo) => (
            <option key={platillo.id_platillo} value={platillo.nombre_platillo}>
              {platillo.nombre_platillo}
            </option>
          ))}
        </select>
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
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir'}
      </button>
    </form>
  );
};

export default AddPlatilloForm;
