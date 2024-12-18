import Table from '@components/Table';
import Search from '../components/Search';
import useGetTipoUtensilio from '../hooks/tipo_utensilio/useGetTipoUtensilio';
import Popup from '@hooks/tipo_utensilio/popupTipoUtensilio.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useDeleteTipoUtensilio from '@hooks/tipo_utensilio/useDeleteTipoUtensilio';
import useEditTipoUtensilio from '../hooks/tipo_utensilio/useEditTipoUtensilio';
import useCreateTipoUtensilio from '@hooks/tipo_utensilio/useCreateTipoUtensilio';
import utensilio from '../../../backend/src/entity/utensilio.entity';

const TiposUtensilio = () => {
  const { tipoUtensilios, fetchTipoUtensilio, setTipoUtensilios } = useGetTipoUtensilio();
  const [filterName, setFilterName] = useState('');
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataTipoUtensilio,
    setDataTipoUtensilio
  } = useEditTipoUtensilio(setTipoUtensilios, fetchTipoUtensilio);

  const { handleDelete } = useDeleteTipoUtensilio(fetchTipoUtensilio, setDataTipoUtensilio);

  const handleSelectionChange = useCallback((selectedItems) => {
    setDataTipoUtensilio(selectedItems);
  }, [setDataTipoUtensilio]);

  const {
    handleClickCreate,
    handleCreate,
    isCreatePopUpOpen,
    setIsCreatePopUpOpen,
    dataTipoUtensilioCreate,
    setDataTipoUtensilioCreate
  } = useCreateTipoUtensilio(setTipoUtensilios);

  const columns = [
    { title: "Nombre", field: "nombre_tipo_utensilio", width: 500, responsive: 0 },
  ];

  const handleNameFilterChange = (e) => {
    setFilterName(e.target.value.toLowerCase());
  };

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Tipo Utensilios</h1>
          <div className='filter-actions'>
            <Search
              value={filterName}
              onChange={handleNameFilterChange}
              placeholder={'Filtrar por nombre'}
            />
            <button className='create-button' onClick={handleClickCreate}>
                <img src={CreateIcon} alt="Crear" />
            </button>
            <button onClick={handleClickUpdate} disabled={dataTipoUtensilio.length === 0}>
              {dataTipoUtensilio.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button className='delete-user-button' 
            disabled={dataTipoUtensilio.length === 0} 
            onClick={() => handleDelete(dataTipoUtensilio)}>
              {dataTipoUtensilio.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={tipoUtensilios}
          columns={columns}
          filter={filterName}
          dataToFilter={'nombre_tipo_utensilio'}
          initialSortName={'nombre_tipo_utensilio'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataTipoUtensilio} action={handleUpdate} titulo={"Editar Tipo Utensilio"} />
      <Popup show={isCreatePopUpOpen} setShow={setIsCreatePopUpOpen} data={dataTipoUtensilioCreate} action={handleCreate} titulo={"Crear Tipo Utensilio"} />
    </div>
  );
};

export default TiposUtensilio;
