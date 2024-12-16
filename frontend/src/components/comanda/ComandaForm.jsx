import React from 'react';

const ComandaForm = ({
  platillos,
  selectedPlatillo,
  setSelectedPlatillo,
  cantidad,
  setCantidad,
  onSubmit,
  loading,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label>Platillo:</label>
        <select
          value={selectedPlatillo}
          onChange={(e) => setSelectedPlatillo(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona un platillo
          </option>
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
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Comanda'}
      </button>
    </form>
  );
};

export default ComandaForm;
