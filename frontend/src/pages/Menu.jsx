import { useAuth } from '../context/AuthContext';
import Search from '@components/Search';
import useGetMenus from '../hooks/menus/useGetMenus';
import PopupMenu from '@hooks/menus/popupMenu';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg'; // Asegúrate de tener un ícono representativo
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
    const { menus, fetchMenus, setMenus } = useGetMenus();
    const { users, fetchUsers } = useUsers();
    const { platillo, fetchPlatillo } = useGetPlatillos();

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchMenus();
        fetchUsers();
        fetchPlatillo();
        console.log("Datos iniciales de menús:", menus);
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

    console.log('menus:', menus);
    const filteredMenus = Array.isArray(menus)
        ? menus.filter((menu) => menu.fecha.toLowerCase().includes(filterName))
        : [];

    // Función para manejar la selección de menús (si es necesario)
    const handleCardSelectionChange = (selectedMenu, isChecked) => {
        if (isChecked) {
            setDataMenu(prev => {
                if (prev.find(item => item.id_menu === selectedMenu.id_menu)) {
                    return prev;
                }
                return [...prev, selectedMenu];
            });
        } else {
            setDataMenu(prev => prev.filter(item => item.id_menu !== selectedMenu.id_menu));
        }
    };

    return (
        <div className="main-container">
            <div className="table-container">
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
                        <button onClick={handleClickUpdate} disabled={dataMenu.length === 0}>
                            {dataMenu.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataMenu.length === 0}
                            onClick={() => handleDelete(dataMenu)}
                        >
                            {dataMenu.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>

                {filteredMenus.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                        {filteredMenus.map(menu => {
                            const isSelected = dataMenu.some(item => item.id_menu === menu.id_menu);
                            return (
                                <MenuCard
                                    key={menu.id_menu}
                                    menu={menu}
                                    isSelected={isSelected}
                                    onSelectChange={handleCardSelectionChange}
                                />
                            );
                        })}
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
            </div>

            <PopupMenu
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataMenu}
                action={handleUpdate}
                usuario={users}
                platillos={platillo}
                isEdit= {true}
            />
            {isCreatePopupOpen && (
                <PopupMenu
                    show={isCreatePopupOpen}
                    setShow={setIsCreatePopupOpen}
                    data={dataMenuCreate || {}}
                    action={handleCreate}
                    usuario={users}
                    platillos={platillo}
                    isEdit= {false}
                />
            )}
        </div>
    );
};

export default Menu;
