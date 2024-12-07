import { useAuth} from '../context/AuthContext';
import Search from '@components/Search';
import useTipoIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetPlatillos from '../hooks/platillos/useGetPlatillos';
import PopupPlatillo from '@hooks/platillos/popupPlatillo';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg'; // Asegúrate de tener un ícono representativo
import { useCallback, useEffect, useState } from 'react';
import '@styles/users.css';
import useDeletePlatillo from '../hooks/platillos/useDeletePlatillo';
import useEditPlatillo from '../hooks/platillos/useEditPlatillo';
import useCreatePlatillo from '../hooks/platillos/useCreatePlatillo';
import PlatilloCard from '../components/Platillo/PlatilloCard';
import useUsers from '../hooks/users/useGetUsers';

const Platillos = () => {
    const { user } = useAuth();
    const { platillo, fetchPlatillo, setPlatillo } = useGetPlatillos();
    const { tiposIngrediente, fetchTiposIngrediente } = useTipoIngrediente();
    const { users, fetchUsers } = useUsers();

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchPlatillo();
        fetchUsers();
        fetchTiposIngrediente();
        console.log("Datos iniciales de platillos:", platillo);
    }, []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPlatillo,
        setDataPlatillo,
    } = useEditPlatillo(setPlatillo, fetchPlatillo);

    const { handleDelete } = useDeletePlatillo(fetchPlatillo, setDataPlatillo);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataPlatilloCreate,
        setDataPlatilloCreate,
    } = useCreatePlatillo(fetchPlatillo, setPlatillo);

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    console.log('platillo:', platillo);
    const filteredPlatillos = Array.isArray(platillo)
        ? platillo.filter((p) => p?.nombre_platillo?.toLowerCase().includes(filterName))
        : [];


    // Función para agregar o quitar platillos seleccionados
    const handleCardSelectionChange = (selectedPlatillo, isChecked) => {
        if (isChecked) {
            // Agregar a la selección si no está presente
            setDataPlatillo(prev => {
                // Evitamos duplicados
                if (prev.find(item => item.id_platillo === selectedPlatillo.id_platillo)) {
                    return prev;
                }
                return [...prev, selectedPlatillo];
            });
        } else {
            // Remover de la selección
            setDataPlatillo(prev => prev.filter(item => item.id_platillo !== selectedPlatillo.id_platillo));
        }
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Platillos</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por nombre"
                        />
                          {user?.rol_usuario === 'cocinero' && (
                            <button className="create-button" onClick={handleClickCreate}>
                                <img src={CreateIcon} alt="Crear" />
                            </button>
                             )}

                        <button onClick={handleClickUpdate} disabled={dataPlatillo.length === 0}>
                            {dataPlatillo.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataPlatillo.length === 0}
                            onClick={() => handleDelete(dataPlatillo)}
                        >
                            {dataPlatillo.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>

                {filteredPlatillos.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                        {filteredPlatillos.map(p => {
                            const isSelected = dataPlatillo.some(item => item.id_platillo === p.id_platillo);
                            return (
                                <PlatilloCard
                                    key={p.id_platillo}
                                    platillo={p}
                                    isSelected={isSelected}
                                    onSelectChange={handleCardSelectionChange}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-container">
                        <img src={EmptyIcon} alt="No hay platillos" className="empty-icon" />
                        <h2 className="empty-message">No hay platillos disponibles</h2>
                        <p className="empty-description">
                            Crea uno nuevo usando el botón <strong>+</strong> en la parte superior.
                        </p>
                    </div>
                )}
            </div>

            <PopupPlatillo
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataPlatillo}
                action={handleUpdate}
                usuario={users}
                tiposIngrediente={tiposIngrediente}
                isEdit={true}
            />
            {tiposIngrediente.length > 0 && (
                <PopupPlatillo
                    show={isCreatePopupOpen}
                    setShow={setIsCreatePopupOpen}
                    data={dataPlatilloCreate || {}}
                    action={handleCreate}
                    usuario={users}
                    tiposIngrediente={tiposIngrediente}
                    isEdit={false}
                />
            )}

        </div>
    );
};

export default Platillos;
