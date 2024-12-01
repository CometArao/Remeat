import Table from '@components/Table';
import Search from '../components/Search';
import useTipoUtensilio from '../hooks/tipo_utensilio/useGetTipoUtensilio';
import Popup from '@hooks/tipo_utensilio/popupTipoUtensilio.jsx'
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


//TODO: Que todas las palabras empiecen en minuscula
//TODO: Revisar si en el backend se ingresan datos solo en minuscula
//Se define componente tipo utensilio
const TiposUtensilio = () => {
  const { tipoUtensilios, fetchTipoUtensilio, setTipoUtensilio } = useTipoUtensilio();
  const [filterName, setFilterName] = useState('');
  //No entiendo esta linea del todo asi que no la voy a borrar todavia
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataTipoUtensilio,
    setDataTipoUtensilio
} = useEditTipoUtensilio(setTipoUtensilio, fetchTipoUtensilio);

  console.log("dataTipoUtensilio")
  console.log(dataTipoUtensilio)
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
  } = useCreateTipoUtensilio(setTipoUtensilio)

  const columns = [
    { title: "Nombre", field: "nombre_tipo_utensilio", width: 500, responsive: 0 },
  ];

  const handleNameFilterChange = (e) => {
    console.log(e)
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
            {/* tmp style. la clase esta en users.css*/}
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
            <button className='delete-user-button' disabled={dataTipoUtensilio.length === 0} onClick={() => handleDelete(dataTipoUtensilio)}>
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
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataTipoUtensilio} action={handleUpdate} titulo = {"Editar Tipo Utensilio"}/>
      <Popup show={isCreatePopUpOpen} setShow={setIsCreatePopUpOpen} data={dataTipoUtensilioCreate} action={handleCreate} titulo={"Crear Utensilio"} />
    </div>
  );
};
export default TiposUtensilio;