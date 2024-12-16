import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHorarioLaboral, updateHorarioLaboral } from "@services/horarios.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import "@styles/crearHorarios.css";

const CrearHorarios = ({ data = null, isEdit = false, actionCallback }) => {
  const navigate = useNavigate();

  const [horarioLaboral, setHorarioLaboral] = useState({
    descripcion: "",
    horariosDia: [],
  });

  const [horarioDia, setHorarioDia] = useState({
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
  });

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (isEdit && data) {
      setHorarioLaboral({
        descripcion: data.descripcion || "",
        horariosDia: data.horario_dia?.map((dia) => ({
          id_horario_dia: dia.id_horario_dia || null,
          dia_semana: dia.dia_semana || "",
          hora_inicio: dia.hora_inicio || "",
          hora_fin: dia.hora_fin || "",
          eliminar: false, // Asegura que no se marque inicialmente
        })) || [],
      });
    }
  }, [isEdit, data]);

  const handleHorarioLaboralChange = (e) => {
    const { name, value } = e.target;
    setHorarioLaboral((prev) => ({ ...prev, [name]: value }));
  };

  const handleHorarioDiaChange = (e) => {
    const { name, value } = e.target;
    setHorarioDia((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHorarioDia = () => {
    if (!horarioDia.dia_semana || !horarioDia.hora_inicio || !horarioDia.hora_fin) {
      showErrorAlert("Error", "Todos los campos de Horario de Día son obligatorios.");
      return;
    }

    setHorarioLaboral((prev) => ({
      ...prev,
      horariosDia: [
        ...prev.horariosDia,
        { ...horarioDia, id_horario_dia: null, eliminar: false }, // Añadir nuevo horario
      ],
    }));

    setHorarioDia({
      dia_semana: "",
      hora_inicio: "",
      hora_fin: "",
    });
  };

  const handleRemoveHorarioDia = (index) => {
    setHorarioLaboral((prev) => ({
      ...prev,
      horariosDia: prev.horariosDia.map((dia, i) =>
        i === index ? { ...dia, eliminar: true } : dia // Marcar para eliminar
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!horarioLaboral.descripcion) {
      showErrorAlert("Error", "La descripción del horario laboral es obligatoria.");
      return;
    }

    const diasAEliminar = horarioLaboral.horariosDia
      .filter((dia) => dia.eliminar && dia.id_horario_dia) // Filtrar días eliminados con ID
      .map((dia) => dia.id_horario_dia);

    const horariosDia = horarioLaboral.horariosDia.filter((dia) => !dia.eliminar); // Excluir días eliminados

    if (horariosDia.length === 0 && diasAEliminar.length === 0) {
      showErrorAlert("Error", "Debes agregar al menos un horario de día.");
      return;
    }

    const payload = {
      descripcion: horarioLaboral.descripcion,
      horario_dia: horariosDia.map((dia) => ({
        dia_semana: dia.dia_semana,
        hora_inicio: dia.hora_inicio,
        hora_fin: dia.hora_fin,
      })),
      diasAEliminar: diasAEliminar || [], // IDs de días a eliminar
    };

    console.log("Payload enviado al servidor:", payload);

    try {
      if (isEdit) {
        await updateHorarioLaboral(data.id_horario_laboral, payload);
        showSuccessAlert("¡Éxito!", "Horario laboral actualizado correctamente.");
      } else {
        await createHorarioLaboral(payload);
        showSuccessAlert("¡Éxito!", "Horario laboral creado correctamente.");
      }

      if (actionCallback) actionCallback();
      navigate("/horarios_laborales");
    } catch (error) {
      console.error("Error al guardar horario laboral:", error);
      showErrorAlert("Error", error.message || "Hubo un problema al guardar el horario laboral.");
    }
  };

  return (
    <div className="crear-horarios-container">
      <h1>{isEdit ? "Editar Horario Laboral" : "Crear Horario Laboral"}</h1>
      <form onSubmit={handleSubmit} className="crear-horarios-form">
        <div className="form-group">
          <label>Descripción del Horario Laboral</label>
          <input
            type="text"
            name="descripcion"
            value={horarioLaboral.descripcion}
            onChange={handleHorarioLaboralChange}
            placeholder="Ej: Turno Matutino"
            required
          />
        </div>

        <div className="form-group">
          <h2>Horarios de Día</h2>
          <div className="horarios-dia-inputs">
            <label>Día de la Semana</label>
            <select name="dia_semana" value={horarioDia.dia_semana} onChange={handleHorarioDiaChange}>
              <option value="">Selecciona un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>

            <label>Hora de Inicio</label>
            <input type="time" name="hora_inicio" value={horarioDia.hora_inicio} onChange={handleHorarioDiaChange} />

            <label>Hora de Fin</label>
            <input type="time" name="hora_fin" value={horarioDia.hora_fin} onChange={handleHorarioDiaChange} />

            <button type="button" onClick={handleAddHorarioDia}>
              Agregar Día
            </button>
          </div>
        </div>

        {horarioLaboral.horariosDia.length > 0 && (
          <div className="horarios-dia-list">
            <h3>Horarios de Día Agregados</h3>
            <ul>
              {horarioLaboral.horariosDia
                .filter((dia) => !dia.eliminar) // Ocultar días eliminados
                .map((dia, index) => (
                  <li key={index}>
                    {dia.dia_semana}: {dia.hora_inicio} - {dia.hora_fin}
                    <button type="button" onClick={() => handleRemoveHorarioDia(index)}>
                      Eliminar
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <button type="submit">{isEdit ? "Guardar Cambios" : "Crear Horario Laboral"}</button>
      </form>
    </div>
  );
};

export default CrearHorarios;
