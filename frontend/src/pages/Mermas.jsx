import Table from '@components/Table';
import useTipoUtensilio from '../hooks/tipo_utensilio/useGetTipoUtensilio';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import { useNavigate } from 'react-router-dom';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import getMermas from '@hooks/mermas/useGetMermas.jsx'
import useCreateMerma from '@hooks/mermas/useCreateMermas.jsx'
//TODO: Que todas las palabras empiecen en minuscula
//TODO: Revisar si en el backend se ingresan datos solo en minuscula
//Se define componente tipo utensilio
const Mermas = () => {
  const { mermas, fetchMermas, setMermas } = getMermas();
  const [filterName, setFilterName] = useState('');
  const columns = [
    { title: "Fecha", field: "fecha_merma", width: 500, responsive: 0 },
  ];
  //Para crear
  const {
    handleClickCreate,
    handleCreate,
    isCreatePopUpOpen,
    setIsCreatePopUpOpen,
    dataMerma,
    setDataMerma
  } = useCreateMerma(setMermas)
  const navigate = useNavigate();
  const handleNavigation = async () => {
    const today = Date()

    navigate('/crear_mermas', { state: today });
  }
  //Para editar
  //Para borrar
  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Mermas</h1>
          <div className='filter-actions'>
            {/* tmp style. la clase esta en users.css*/}
            <button className='create-button' onClick={handleClickCreate}>
              <img src={CreateIcon} alt="Crear" />
            </button>
          </div>
        </div>
        <Table
          data={mermas}
          columns={columns}
        />
      </div>
    </div>
  );
};
export default Mermas;