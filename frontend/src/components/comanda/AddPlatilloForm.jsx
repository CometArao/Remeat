import React, { useEffect, useState } from 'react';
import useAddPlatilloToComanda from '../../hooks/comandas/useAddPlatilloToComanda';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert';

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
      showSuccessAlert('¡Platillo Añadido!', 'El platillo ha sido añadido a la comanda exitosamente.');
    } catch (error) {
      showErrorAlert('Error', error.message);
      
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
