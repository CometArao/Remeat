import React, { useState, useEffect } from 'react';
import Form from '@components/Form';
import CloseIcon from '@assets/XIcon.svg';
import '@styles/popup.css';

export default function PopupHorarioLaboral({
  show,
  setShow,
  data,
  action,
  isEdit,
}) {
  const [horariosDia, setHorariosDia] = useState([]);
  const [descripcion, setDescripcion] = useState('');

  // Cargar datos si es edición
  useEffect(() => {
    if (isEdit && data) {
      setDescripcion(data.descripcion || '');
      setHorariosDia(
        data.horario_dia?.map((dia) => ({
          id_horario_dia: dia.id_horario_dia || null,
          dia_semana: dia.dia_semana || '',
          hora_inicio: dia.hora_inicio || '',
          hora_fin: dia.hora_fin || '',
        })) || []
      );
    } else {
      setDescripcion('');
      setHorariosDia([]);
    }
  }, [isEdit, data]);

  // Manejar cambios en el horario de día
  const handleHorarioDiaChange = (index, field, value) => {
    const updatedHorariosDia = [...horariosDia];
    updatedHorariosDia[index][field] = value;
    setHorariosDia(updatedHorariosDia);
  };

  // Agregar un nuevo horario de día
  const handleAddHorarioDia = () => {
    setHorariosDia([
      ...horariosDia,
      { id_horario_dia: null, dia_semana: '', hora_inicio: '', hora_fin: '' },
    ]);
  };

  // Eliminar un horario de día
  const handleRemoveHorarioDia = (index) => {
    const updatedHorariosDia = horariosDia.filter((_, i) => i !== index);
    setHorariosDia(updatedHorariosDia);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    if (horariosDia.some((dia) => !dia.dia_semana || !dia.hora_inicio || !dia.hora_fin)) {
      alert('Todos los horarios de día deben estar completos');
      return;
    }

    const payload = {
      descripcion,
      horario_dia: horariosDia,
    };

    action(payload); // Ejecuta la acción (crear o editar)
    setShow(false); // Cierra el popup
  };

  return (
    <div>
      {show && (
        <div className="bg">
          <div className="popup">
            <button className="close" onClick={() => setShow(false)}>
              <img src={CloseIcon} alt="Cerrar" />
            </button>
            <form onSubmit={handleSubmit} className="crear-horarios-form">
              <h2>{isEdit ? 'Editar Horario Laboral' : 'Crear Horario Laboral'}</h2>
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Turno Matutino"
                  required
                />
              </div>
              <div className="horarios-dia-container">
                <h3>Horarios de Día</h3>
                {horariosDia.map((dia, index) => (
                  <div key={index} className="horario-dia-row">
                    <select
                      value={dia.dia_semana}
                      onChange={(e) =>
                        handleHorarioDiaChange(index, 'dia_semana', e.target.value)
                      }
                      required
                    >
                      <option value="">Selecciona un día</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                    <input
                      type="time"
                      value={dia.hora_inicio}
                      onChange={(e) =>
                        handleHorarioDiaChange(index, 'hora_inicio', e.target.value)
                      }
                      required
                    />
                    <input
                      type="time"
                      value={dia.hora_fin}
                      onChange={(e) =>
                        handleHorarioDiaChange(index, 'hora_fin', e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      className="remove-horario-dia"
                      onClick={() => handleRemoveHorarioDia(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-horario-dia"
                  onClick={handleAddHorarioDia}
                >
                  Agregar Horario Día
                </button>
              </div>
              <button type="submit" className="save-button">
                {isEdit ? 'Guardar Cambios' : 'Crear Horario Laboral'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
