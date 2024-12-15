import Table from '@components/Table';
import useUsers from '@hooks/users/useGetUsers';
import PopupFormUser from '@hooks/users/popupFormUser';
import CreateIcon from '@assets/PlusIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import UpdateIconDisable from '@assets/updateIconDisabled.svg';
import DeleteIconDisable from '@assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import useCreateUser from '@hooks/users/useCreateUser';

const Users = () => {
    const { users, fetchUsers, setUsers } = useUsers();
    const [filterName, setFilterName] = useState('');

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUser,
        setDataUser,
    } = useEditUser(setUsers, fetchUsers);

    const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
    } = useCreateUser(setUsers, fetchUsers);

    const handleSelectionChange = useCallback(
        (selectedUsers) => {
            setDataUser(selectedUsers);
        },
        [setDataUser]
    );

    const columns = [
        {title: 'ID', field: 'id_usuario', width: 100},
        { title: 'Nombre', field: 'nombre_usuario', width: 200 },
        { title: 'Apellido', field: 'apellido_usuario', width: 200 },
        { title: 'Correo', field: 'correo_usuario', width: 300 },
        { title: 'Rol', field: 'rol_usuario', width: 150 },
        { title: 'Horario Laboral', field: 'horario_laboral.descripcion', width: 200 },
    ];

    const handleFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Usuarios</h1>
                    <div className="filter-actions">
                        {/* Input de filtro por nombre */}
                        <input
                            type="text"
                            placeholder="Filtrar por nombre"
                            value={filterName}
                            onChange={handleFilterChange}
                            className="filter-input"
                        />
                        {/* Botón Crear Usuario */}
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear Usuario" />
                        </button>
                        {/* Botón Editar Usuario */}
                        <button
                            onClick={handleClickUpdate}
                            disabled={dataUser.length === 0}
                        >
                            <img
                                src={dataUser.length === 0 ? UpdateIconDisable : UpdateIcon}
                                alt="Editar Usuario"
                            />
                        </button>
                        {/* Botón Eliminar Usuario */}
                        <button
                            className="delete-user-button"
                            disabled={dataUser.length === 0}
                            onClick={() => handleDelete(dataUser)}
                        >
                            <img
                                src={dataUser.length === 0 ? DeleteIconDisable : DeleteIcon}
                                alt="Eliminar Usuario"
                            />
                        </button>
                    </div>
                </div>
                <Table
                    data={users}
                    columns={columns}
                    filter={filterName}
                    dataToFilter="nombre_usuario"
                    initialSortName="id_usuario"
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            {/* Popup para Editar Usuario */}
            <PopupFormUser
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataUser}
                action={handleUpdate}
                isEdit={true}
            />
            {/* Popup para Crear Usuario */}
            <PopupFormUser
                show={isCreatePopUpOpen}
                setShow={setIsCreatePopUpOpen}
                data={[]}
                action={handleCreate}
                isEdit={false}
            />
        </div>
    );
};

export default Users;