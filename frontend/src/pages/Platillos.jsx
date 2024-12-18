import { useAuth } from '../context/AuthContext';
import Search from '@components/Search';
import useTipoIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetPlatillos from '../hooks/platillos/useGetPlatillos';
import PopupPlatillo from '@hooks/platillos/popupPlatillo';
import PopupPrecio from '@hooks/platillos/popupPrecio';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg';
import { useEffect, useState } from 'react';
import '@styles/platillos.css'; // Estilos adaptados
import PlatilloCard from '../components/Platillo/PlatilloCard';
import useDeletePlatillo from '../hooks/platillos/useDeletePlatillo';
import useEditPlatillo from '../hooks/platillos/useEditPlatillo';
import useCreatePlatillo from '../hooks/platillos/useCreatePlatillo';
import useEditPrecioPlatillo from '../hooks/platillos/useEditPrecioPlatillo';
import useUsers from '../hooks/users/useGetUsers';

const Platillos = () => {
    const { user } = useAuth();
    const { platillo, fetchPlatillo, setPlatillo } = useGetPlatillos();
    const { tiposIngrediente, fetchTiposIngrediente } = useTipoIngrediente();
    const { users, fetchUsers } = useUsers();

    const [filterName, setFilterName] = useState('');
    const [dataPlatillo, setDataPlatillo] = useState([]); // Platillo seleccionado

    const { handleClickUpdate, handleUpdate, isPopupOpen, setIsPopupOpen } =
        useEditPlatillo(setPlatillo, fetchPlatillo);
    const { handleDelete } = useDeletePlatillo(fetchPlatillo, setDataPlatillo);
    const { handleClickCreate, handleCreate, isCreatePopupOpen, setIsCreatePopupOpen, dataPlatilloCreate, setDataPlatilloCreate } =
        useCreatePlatillo(fetchPlatillo, setPlatillo);
    const { handleClickEditPrice, handleUpdatePrice, isEditPricePopupOpen, setIsEditPricePopupOpen } = useEditPrecioPlatillo(fetchPlatillo);

    const [selectedPlatillo, setSelectedPlatillo] = useState(null);

    useEffect(() => {
        fetchPlatillo();
        fetchUsers();
        fetchTiposIngrediente();
    }, []);

    const handleNameFilterChange = (e) => setFilterName(e.target.value.toLowerCase());

    const filteredPlatillos = Array.isArray(platillo)
        ? platillo.filter((p) => p.nombre_platillo.toLowerCase().includes(filterName))
        : [];

    const handleCardSelectionChange = (selectedPlatillo) => {
        setDataPlatillo((prev) => (prev.length > 0 && prev[0].id_platillo === selectedPlatillo.id_platillo ? [] : [selectedPlatillo]));
        setSelectedPlatillo(selectedPlatillo);
    };

    // Ajustar el botón Editar para asegurar que el platillo seleccionado se edite
    const handleEditPlatillo = () => {
        if (selectedPlatillo) {
            setDataPlatillo([selectedPlatillo]); // Lo pasamos al array de edición
            setIsPopupOpen(true); // Abrir el Popup de edición
        }
    };

    return (
        <div className="platillo-container">
            <div className="top-platillo-table">
                <h1 className="title-platillo-table">Platillos</h1>
                <div className="filter-platillo-actions">
                    <Search value={filterName} onChange={handleNameFilterChange} placeholder="Buscar por nombre" />
                    {user?.rol_usuario === 'cocinero' && (
                        <button className="create-platillo-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                    )}
                    {user?.rol_usuario === 'cocinero' && (
                        <button onClick={handleEditPlatillo} disabled={!selectedPlatillo}>
                            <img src={!selectedPlatillo ? UpdateIconDisable : UpdateIcon} alt="Actualizar" />
                        </button>
                    )}
                    {user?.rol_usuario === 'cocinero' && (
                        <button
                            className="delete-platillo-button"
                            onClick={() => handleDelete(dataPlatillo)}
                            disabled={dataPlatillo.length === 0}
                        >
                            <img src={dataPlatillo.length === 0 ? DeleteIconDisable : DeleteIcon} alt="Eliminar" />
                        </button>
                    )}
                    {user?.rol_usuario === 'administrador' && (
                        <button
                            className="edit-price-button"
                            onClick={() => selectedPlatillo && handleClickEditPrice(selectedPlatillo)}
                            disabled={!selectedPlatillo}
                        >
                            Editar Precio
                        </button>
                    )}
                </div>
            </div>

            {filteredPlatillos.length > 0 ? (
                <div className="platillo-container">
                    {filteredPlatillos.map((p) => {
                        const isSelected = dataPlatillo.length > 0 && dataPlatillo[0].id_platillo === p.id_platillo;
                        return (
                            <PlatilloCard
                                key={p.id_platillo}
                                platillo={p}
                                isSelected={isSelected}
                                onSelectChange={() => handleCardSelectionChange(p)}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="empty-platillo-container">
                    <img src={EmptyIcon} alt="No hay platillos" className="empty-platillo-icon" />
                    <h2 className="empty-platillo-message">No hay platillos disponibles</h2>
                    <p className="empty-platillo-description">
                        Crea uno nuevo usando el botón <strong>+</strong> en la parte superior.
                    </p>
                </div>
            )}

            {/* Popup para editar precio */}
            {isEditPricePopupOpen && (
                <PopupPrecio
                    show={isEditPricePopupOpen}
                    setShow={setIsEditPricePopupOpen}
                    data={selectedPlatillo}
                    action={handleUpdatePrice}
                />
            )}

            {/* Popup para editar y crear platillos */}
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
