import Table from '@components/Table';
import useUsers from '@hooks/users/useGetUsers';
import PopupFormUser from '@hooks/users/popupFormUser';
import Search from '../components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';

const Users = () => {
  // State and Hooks
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

  // Event Handlers
  const handleNameFilterChange = (e) => {
    setFilterName(e.target.value.toLowerCase());
  };

  const handleSelectionChange = useCallback(
    (selectedUsers) => {
      setDataUser(selectedUsers);
    },
    [setDataUser]
  );

  // Columns for Table
  const columns = [
    { title: 'Nombre', field: 'nombre_usuario', width: 200 },
    { title: 'Apellido', field: 'apellido_usuario', width: 200 },
    { title: 'Correo', field: 'correo_usuario', width: 300 },
    { title: 'Rol', field: 'rol_usuario', width: 150 },
  ];

  return (
    <div className="main-container">
      {/* Table Container */}
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Usuarios</h1>
          <div className="filter-actions">
            {/* Search Input */}
            <Search
              value={filterName}
              onChange={handleNameFilterChange}
              placeholder={'Filtrar por nombre'}
            />
            {/* Update Button */}
            <button onClick={handleClickUpdate} disabled={dataUser.length === 0}>
              <img
                src={dataUser.length === 0 ? UpdateIconDisable : UpdateIcon}
                alt="edit"
              />
            </button>
            {/* Delete Button */}
            <button
              className="delete-user-button"
              disabled={dataUser.length === 0}
              onClick={() => handleDelete(dataUser)}
            >
              <img
                src={dataUser.length === 0 ? DeleteIconDisable : DeleteIcon}
                alt="delete"
              />
            </button>
          </div>
        </div>
        {/* Users Table */}
        <Table
          data={users}
          columns={columns}
          filter={filterName}
          dataToFilter={'nombre_usuario'}
          initialSortName={'nombre_usuario'}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Popup Form for Editing User */}
      <PopupFormUser
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataUser}
        action={handleUpdate}
      />
    </div>
  );
};

export default Users;
