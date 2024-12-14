const HorarioLaboralCard = ({ horario, isSelected, onSelectChange }) => {
    const handleCheckboxChange = (e) => {
        onSelectChange(horario, e.target.checked);
    };

    return (
        <div className="pedido-card" style={{ position: 'relative' }}>
            <span className="card-id">ID: {horario.id_horario_laboral}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="menu-title">{horario.descripcion}</h2>
                <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} />
            </div>
            <h4>Horarios Día:</h4>
            <ul>
                {horario.horario_dia.map((dia) => (
                    <li key={dia.id_horario_dia}>
                        {dia.dia_semana}: {dia.hora_inicio} - {dia.hora_fin}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HorarioLaboralCard;
