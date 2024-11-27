import { useState, useEffect } from 'react';
import '@styles/popup.css';

const CreateIngredientePopup = ({ show, setShow, title, onSubmit, data }) => {
  const [formData, setFormData] = useState(data || {
    nombre_ingrediente: '',
    cantidad_ingrediente: 0,
  });

  useEffect(() => {
    setFormData(data || {
      nombre_ingrediente: '',
      cantidad_ingrediente: 0,
    });
  }, [data]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>{title}</h2>
        <div className="popup-form">
          <div className="form-field">
            <label>Nombre del Ingrediente:</label>
            <input
              type="text"
              name="nombre_ingrediente"
              value={formData.nombre_ingrediente}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad_ingrediente"
              value={formData.cantidad_ingrediente}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="popup-actions">
            <button className="save-button" onClick={handleSubmit}>
              Guardar
            </button>
            <button className="cancel-button" onClick={() => setShow(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIngredientePopup;