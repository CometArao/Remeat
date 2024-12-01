
import Table from '@components/Table';
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
  //No entiendo esta linea del todo asi que no la voy a borrar todavia
  //const [filterRut, setFilterRut] = useState('');
  //const {
    //handleClickUpdate,
    //handleUpdate,
    //isPopupOpen,
    //setIsPopupOpen,
    //dataTipoUtensilio,
    //setDataTipoUtensilio
  //} = useEditTipoUtensilio(setTipoUtensilio);

  //const { handleDelete } = useDeleteTipoUtensilio(fetchTipoUtensilio, setDataTipoUtensilio);

  //const handleSelectionChange = useCallback((selectedItems) => {
    //setDataTipoUtensilio(selectedItems);
  //}, [setDataTipoUtensilio]);

  //const {
    //handleClickCreate,
    //handleCreate,
    //isCreatePopUpOpen,
    //setIsCreatePopUpOpen,
    //dataTipoUtensilioCreate,
    //setDataTipoUtensilioCreate
  //} = useCreateTipoUtensilio(setTipoUtensilio)

  const columns = [
    { title: "Nombre", field: "nombre_tipo_utensilio", width: 500, responsive: 0 },
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Tipo Ingredientes</h1>
          <div className='filter-actions'>
          </div>
        </div>
        <Table
          data={tipoUtensilios}
          columns={columns}
        />
      </div>
    </div>
  );
};
export default TiposUtensilio;