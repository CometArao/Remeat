import { useAuth } from '../context/AuthContext';
import Search from '@components/Search';
import useGetMenus from '../hooks/menus/useGetMenus';
import PopupMenu from '@hooks/menus/popupMenu';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg';
import { useEffect, useState } from 'react';
import '@styles/users.css';
import useDeleteMenu from '../hooks/menus/useDeletedMenu';
import useEditMenu from '../hooks/menus/useEditMenu';
import useCreateMenu from '../hooks/menus/useCreateMenu';
import MenuCard from '../components/Menu/MenuCard';
import useUsers from '../hooks/users/useGetUsers';
import useGetPlatillos from '../hooks/platillos/useGetPlatillos';

const Menu = () => {
    const { user } = useAuth();
    const { menus = [], fetchMenus, setMenus } = useGetMenus(); // Default a []
    const { users = [], fetchUsers } = useUsers(); // Default a []
    const { platillo = [], fetchPlatillo } = useGetPlatillos(); // Default a []

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchMenus();
        fetchUsers();
        fetchPlatillo();
    }, []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataMenu,
        setDataMenu,
    } = useEditMenu(setMenus, fetchMenus);

    const { handleDelete } = useDeleteMenu(fetchMenus, setDataMenu);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataMenuCreate,
        setDataMenuCreate,
    } = useCreateMenu(fetchMenus, setMenus);

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    const filteredMenus = menus.filter((menu) =>
        menu?.fecha?.toLowerCase().includes(filterName)
    );

    const handleCardSelectionChange = (selectedMenu, isChecked) => {
        if (isChecked) {
            setDataMenu((prev) =>
                prev.find((item) => item.id_menu === selectedMenu.id_menu)
                    ? prev
                    : [...prev, selectedMenu]
            );
        } else {
            setDataMenu((prev) =>
                prev.filter((item) => item.id_menu !== selectedMenu.id_menu)
            );
        }
    };

    return (
        <div className="main-container">
            <div className="top-table">
                <h1 className="title-table">Menús</h1>
                <div className="filter-actions">
                    <Search
                        value={filterName}
                        onChange={handleNameFilterChange}
                        placeholder="Buscar por fecha"
                    />
                    {['cocinero', 'administrador'].includes(user?.rol_usuario) && (
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                    )}
                    {['cocinero', 'administrador'].includes(user?.rol_usuario) && (
                        <button onClick={handleClickUpdate} disabled={!dataMenu.length}>
                            <img
                                src={!dataMenu.length ? UpdateIconDisable : UpdateIcon}
                                alt="Editar"
                            />
                        </button>
                    )}
                    {['cocinero', 'administrador'].includes(user?.rol_usuario) && (
                        <button
                            className="delete-user-button"
                            disabled={!dataMenu.length}
                            onClick={() => handleDelete(dataMenu)}
                        >
                            <img
                                src={!dataMenu.length ? DeleteIconDisable : DeleteIcon}
                                alt="Eliminar"
                            />
                        </button>
                    )}
                </div>
            </div>

            {filteredMenus.length > 0 ? (
                <div className="container">
                    {filteredMenus.map((menu) => (
                        <MenuCard
                            key={menu.id_menu}
                            menu={menu}
                            isSelected={dataMenu.some(
                                (item) => item.id_menu === menu.id_menu
                            )}
                            onSelectChange={handleCardSelectionChange}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <img src={EmptyIcon} alt="No hay menús" className="empty-icon" />
                    <h2 className="empty-message">No hay menús disponibles</h2>
                    <p className="empty-description">
                        Crea uno nuevo usando el botón <strong>+</strong> en la parte superior.
                    </p>
                </div>
            )}

            <PopupMenu
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataMenu}
                action={handleUpdate}
                usuario={users}
                platillos={platillo} // Filtrados
                isEdit={true}
            />
            {isCreatePopupOpen && (
                <PopupMenu
                    show={isCreatePopupOpen}
                    setShow={setIsCreatePopupOpen}
                    data={dataMenuCreate || {}}
                    action={handleCreate}
                    usuario={users}
                    platillos={platillo} // Filtrados
                    isEdit={false}
                />
            )}
        </div>
    );
};

export default Menu;
