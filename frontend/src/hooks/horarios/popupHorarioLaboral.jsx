import React, { useState, useEffect } from 'react';
import CloseIcon from '@assets/XIcon.svg';
import { createHorarioLaboral } from '@services/horarios.service.js';
import { truncateToMinutes2 } from '../../../../backend/src/utils/dateUtils.js'; // Asegúrate de la ruta correcta
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
          hora_inicio: truncateToMinutes2(dia.hora_inicio)|| '',
          hora_fin: truncateToMinutes2(dia.hora_fin) || '',
        })) || []
      );
    } else {
      setDescripcion('');
      setHorariosDia([]);
    }
  }, [isEdit, data]);

  // Maneja cambios en los horarios día
  const handleHorarioDiaChange = (index, field, value) => {
    setHorariosDia((prev) =>
      prev.map((dia, i) =>
        i === index
          ? {
              ...dia,
              [field]: field.includes('hora') ? truncateToMinutes2(value) : value, // Trunca las horas
            }
          : dia
      )
    );
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
            hora_inicio: truncateToMinutes2(horarioDia.hora_inicio), 
            hora_fin: truncateToMinutes2(horarioDia.hora_fin)
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
  setHorariosDia((prev) =>
    prev.map((dia, i) => 
      i === index
        ? { ...dia, eliminar: true } // Marcar para eliminar
        : dia
    )
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!descripcion.trim()) {
    alert("La descripción es obligatoria");
    return;
  }

  // Extrae los IDs de los días marcados como eliminar
  const diasAEliminar = horariosDia
    .filter((dia) => dia.eliminar)
    .map((dia) => dia.id_horario_dia);

  console.log("Días a eliminar:", diasAEliminar); // LOG para depuración

  const payload = {
    descripcion,
    horariosDia: horariosDia.filter((dia) => !dia.eliminar), // Excluye días eliminados
    diasAEliminar: diasAEliminar || [], // Asegura que siempre sea un array
  };

  console.log("Payload enviado:", payload); // LOG para depuración

  try {
    await action(payload); // Callback reutilizable
    alert(isEdit ? "Horario laboral actualizado" : "Horario laboral creado");
    setShow(false);
  } catch (error) {
    console.error("Error al guardar horario laboral:", error);
    alert("Hubo un problema al guardar el horario laboral.");
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
