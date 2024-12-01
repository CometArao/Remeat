import Table from '@components/Table';
import Popup from '@hooks/ingredientes/popupIngrediente';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useGetTipoIngrediente from '../hooks/ingredientes/useGetIngredientes';

//TODO: Que todas las palabras empiecen en minuscula
//TODO: Revisar si en el backend se ingresan datos solo en minuscula
//Se define componente tipo utensilio
const Ingredientes = () => {
  const { ingredientes, fetchTipoIngrediente, setTipoIngredientes }
    = useGetTipoIngrediente();
  //No entiendo esta linea del todo asi que no la voy a borrar todavia
  //const [filterRut, setFilterRut] = useState('');
  //const {
    //handleClickUpdate,
    //handleUpdate,
    //isPopupOpen,
    //setIsPopupOpen,
    //dataTipoUtensilio,
    //setDataTipoIngrediente
  //} = useEditTipoIngrediente(setTipoUtensilio);

  //const { handleDelete } = useDeleteTipoUtensilio(fetchTipoUtensilio, setDataTipoUtensilio);

  //const handleSelectionChange = useCallback((selectedItems) => {
    //setDataTipoIngrediente(selectedItems);
  //}, [setDataTipoIngrediente]);

  //const {
    //handleClickCreate,
    //handleCreate,
    //isCreatePopUpOpen,
    //setIsCreatePopUpOpen,
    //dataTipoUtensilioCreate,
    //setDataTipoUtensilioCreate
  //} = useCreateTipoUtensilio(setTipoUtensilio)

  const columns = [
    { title: "Nombre", field: "nombre_tipo_ingrediente", width: 500, responsive: 0 },
  ];

  console.log(ingredientes)
  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Tipo Ingredientes</h1>
          <div className='filter-actions'>
          </div>
        </div>
        <Table
          data={ingredientes}
          initialSortName={'nombre_tipo_ingrediente'}
          columns={columns}
        />
      </div>
      
    </div>
  );
};
export default Ingredientes;