import React, { useState, useEffect } from 'react';
import CloseIcon from '@assets/XIcon.svg';
import { createHorarioLaboral } from '@services/horarios.service.js';
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
  const [horarioDia, setHorarioDia] = useState({
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
});


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

  const handleHorarioDiaChange = (index, field, value) => {
    const updatedHorariosDia = [...horariosDia];
    updatedHorariosDia[index][field] = value;
    setHorariosDia(updatedHorariosDia);
  };

  const handleAddHorarioDia = () => {
    if (!horarioDia.dia_semana || !horarioDia.hora_inicio || !horarioDia.hora_fin) {
        alert("Todos los campos de Horario de Día son obligatorios.");
        return;
    }

    // Agregar un nuevo horario al estado
    setHorariosDia((prev) => [
        ...prev,
        { 
            id_horario_dia: null, 
            dia_semana: horarioDia.dia_semana, 
            hora_inicio: horarioDia.hora_inicio, 
            hora_fin: horarioDia.hora_fin 
        },
    ]);

    // Limpiar el formulario de horarios día
    setHorarioDia({
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
    });
};


  const handleRemoveHorarioDia = (index) => {
    const updatedHorariosDia = horariosDia.filter((_, i) => i !== index);
    setHorariosDia(updatedHorariosDia);
  };

  const handleSubmit = async (e) => {
    console.log("Estado actual de horariosDia:", horariosDia);
    e.preventDefault();

    if (!descripcion.trim()) {
        alert('La descripción es obligatoria');
        return;
    }

    if (horariosDia.length === 0) {
        alert('Debes agregar al menos un horario de día.');
        return;
    }

    const payload = {
      descripcion,
      horario_dia: horariosDia.map((dia) => ({
          dia_semana: dia.dia_semana,
          hora_inicio: dia.hora_inicio,
          hora_fin: dia.hora_fin,
      })),
  };
    console.log("Payload enviado al servidor:", payload);

    try {
        await createHorarioLaboral(payload);
        alert('Horario laboral creado con éxito');
        setShow(false);
    } catch (error) {
        console.error('Error creando horario laboral:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Hubo un problema al crear el horario laboral');
    }
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
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(
                        (dia) => (
                          <option key={dia} value={dia}>
                            {dia}
                          </option>
                        )
                      )}
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
                      onClick={() => handleRemoveHorarioDia(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddHorarioDia}>
                  Agregar Horario Día
                </button>
              </div>
              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
