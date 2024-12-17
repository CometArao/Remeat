import { useAuth } from '../context/AuthContext';
import Search from '@components/Search';
import useGetMenus from '../hooks/menus/useGetMenus';
import PopupMenu from '@hooks/menus/popupMenu';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import EmptyIcon from '../assets/emptyIcon.svg';
import { useEffect, useState } from 'react';
import '@styles/menu.css';
import useDeleteMenu from '../hooks/menus/useDeletedMenu';
import useEditMenu from '../hooks/menus/useEditMenu';
import useCreateMenu from '../hooks/menus/useCreateMenu';
import MenuCard from '../components/Menu/MenuCard';
import useUsers from '../hooks/users/useGetUsers';
import useGetPlatillos from '../hooks/platillos/useGetPlatillos';
import useActivateMenu from '../hooks/menus/useActivateMenu';

const Menu = () => {
    const { user } = useAuth();
    const { menus, fetchMenus, setMenus } = useGetMenus();
    const { users, fetchUsers } = useUsers();
    const { platillo, fetchPlatillo } = useGetPlatillos();

    const [filterName, setFilterName] = useState('');
    const [dataMenu, setDataMenu] = useState([]); // Menú seleccionado

    const { handleActivateMenu, isActivating } = useActivateMenu(fetchMenus);
    const { handleDelete } = useDeleteMenu(fetchMenus, setDataMenu);
    const { handleClickUpdate, handleUpdate, isPopupOpen, setIsPopupOpen } = useEditMenu(setMenus, fetchMenus);
    const { handleClickCreate, handleCreate, isCreatePopupOpen, setIsCreatePopupOpen } = useCreateMenu(fetchMenus, setMenus);

    useEffect(() => {
        fetchMenus();
        fetchUsers();
        fetchPlatillo();
    }, []);

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    const filteredMenus = menus.filter((menu) => menu.fecha.toLowerCase().includes(filterName));

    const handleCardSelectionChange = (selectedMenu) => {
        setDataMenu((prev) => (prev.length > 0 && prev[0].id_menu === selectedMenu.id_menu ? [] : [selectedMenu]));
    };

    return (
        <div className="menu-container">
            <div className="top-menu-table">
                <h1 className="title-menu-table">Menús</h1>
                <div className="filter-menu-actions">
                    <Search value={filterName} onChange={handleNameFilterChange} placeholder="Buscar por fecha" />
                    <button className="create-menu-button" onClick={handleClickCreate}>
                        <img src={CreateIcon} alt="Crear menú" />
                    </button>
                    <button
                        onClick={() => handleClickUpdate(dataMenu[0])} // Pasa el menú seleccionado
                        disabled={dataMenu.length === 0}
                    >
                        <img src={UpdateIcon} alt="Editar menú" />
                    </button>
                    <button onClick={() => handleDelete(dataMenu)} disabled={dataMenu.length === 0}>
                        <img src={DeleteIcon} alt="Eliminar menú" />
                    </button>
                </div>
            </div>

            {filteredMenus.length > 0 ? (
                <div className="container-menu">
                    {filteredMenus.map((menu) => {
                        const isSelected = dataMenu.length > 0 && dataMenu[0].id_menu === menu.id_menu;
                        return (
                            <MenuCard
                                key={menu.id_menu}
                                menu={menu}
                                isSelected={isSelected}
                                onSelectChange={handleCardSelectionChange}
                                onActivate={handleActivateMenu}
                                isActivating={isActivating}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="empty-container">
                    <img src={EmptyIcon} alt="No hay menús" className="empty-icon" />
                    <h2 className="empty-message">No hay menús disponibles</h2>
                </div>
            )}

            <PopupMenu
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataMenu}
                action={handleUpdate}
                usuario={users}
                platillos={platillo}
                isEdit={true}
            />

            {isCreatePopupOpen && (
                <PopupMenu
                    show={isCreatePopupOpen}
                    setShow={setIsCreatePopupOpen}
                    data={{}}
                    action={handleCreate}
                    usuario={users}
                    platillos={platillo}
                    isEdit={false}
                />
            )}
        </div>
    );
};

export default Menu;
