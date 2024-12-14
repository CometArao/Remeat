import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '@components/Search';
import HorarioLaboralCard from '../components/Horarios/HorarioLaboralCard';
import useGetHorariosLaborales from '../hooks/horarios/useGetHorariosLaborales';
import useDeleteHorarioLaboral from '../hooks/horarios/useDeleteHorarioLaboral';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg';
import '@styles/horarios.css';

const HorariosLaborales = () => {
    const navigate = useNavigate();
    const { horariosLaborales, fetchHorariosLaborales } = useGetHorariosLaborales();
    const [filterName, setFilterName] = useState('');
    const [dataHorarioLaboral, setDataHorarioLaboral] = useState([]);

    const { handleDelete } = useDeleteHorarioLaboral(fetchHorariosLaborales, setDataHorarioLaboral);

    const filteredHorariosLaborales = useCallback(
        () =>
            horariosLaborales.filter((horario) =>
                horario.descripcion.toLowerCase().includes(filterName)
            ),
        [horariosLaborales, filterName]
    );

    useEffect(() => {
        fetchHorariosLaborales();
    }, []);

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    const handleCardSelectionChange = useCallback((selectedHorario, isChecked) => {
        setDataHorarioLaboral((prev) => {
            if (isChecked) {
                if (!prev.some((item) => item.id_horario_laboral === selectedHorario.id_horario_laboral)) {
                    return [...prev, selectedHorario];
                }
            } else {
                return prev.filter((item) => item.id_horario_laboral !== selectedHorario.id_horario_laboral);
            }
            return prev;
        });
    }, []);

    const handleEditClick = () => {
        if (dataHorarioLaboral.length === 1) {
            navigate(`/modificar_horario/${dataHorarioLaboral[0].id_horario_laboral}`);
        }
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Horarios Laborales</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por descripción"
                        />
                        <button className="create-button" onClick={() => navigate('/crear_horario')}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleEditClick} disabled={dataHorarioLaboral.length !== 1}>
                            {dataHorarioLaboral.length !== 1 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataHorarioLaboral.length === 0}
                            onClick={() => handleDelete(dataHorarioLaboral)}
                        >
                            {dataHorarioLaboral.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>

                {filteredHorariosLaborales().length > 0 ? (
                    <div className="container">
                        {filteredHorariosLaborales().map((horario) => (
                            <HorarioLaboralCard
                                key={horario.id_horario_laboral}
                                horario={horario}
                                isSelected={dataHorarioLaboral.some(
                                    (item) => item.id_horario_laboral === horario.id_horario_laboral
                                )}
                                onSelectChange={handleCardSelectionChange}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-container">
                        <img src={EmptyIcon} alt="No hay horarios laborales" className="empty-icon" />
                        <h2 className="empty-message">No hay horarios laborales disponibles</h2>
                        <p className="empty-description">
                            Crea uno nuevo usando el botón <strong>+</strong> en la parte superior.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HorariosLaborales;
