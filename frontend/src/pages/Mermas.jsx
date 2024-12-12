import Table from '@components/Table';
import useGetTipoUtensilio from '../hooks/tipo_utensilio/useGetTipoUtensilio';
import Popup from '@hooks/tipo_utensilio/popupTipoUtensilio.jsx'
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import InfoIcon from '../assets/InfoIcon.svg';
import InfoIconDisabled from '../assets/InfoIconDisabled.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import getMermas from '@hooks/mermas/useGetMermas.jsx'
import useCreateMerma from '@hooks/mermas/useCreateMermas.jsx'
import { useNavigate } from 'react-router-dom';
import useDeleteMerma from '../hooks/mermas/useDeleteMerma';
import { getmerma } from '@services/merma.service.js'
//TODO: Que todas las palabras empiecen en minuscula
//TODO: Revisar si en el backend se ingresan datos solo en minuscula
const Mermas = () => {
  const navigate = useNavigate();
  const { mermas, fetchMermas, setMermas } = getMermas();
  console.log("Mermas")
  console.log(mermas)
  const columns = [
    { title: "Fecha", field: "fecha_merma", width: 500, responsive: 0 },
  ];
  //Para crear
  //const {
  //handleClickCreate,
  //handleCreate,
  //isCreatePopUpOpen,
  //setIsCreatePopUpOpen,
  //dataMerma,
  //setDataMerma
  //} = useCreateMerma(setMermas)
  const handleClickCreate = () => {
    navigate('/crear_mermas');
  }
  const [dataMermas, setDataMermas] = useState([]);
  const handleSelectionChange = useCallback((selectedItems) => {
    setDataMermas(selectedItems);
  }, [setDataMermas]);
  //Para editar
  //Para borrar
  const { handleDelete } = useDeleteMerma(fetchMermas, setDataMermas);

  const handleDetalle = async () => {
    //consultar ingredientes y utensilios asociados
    console.log("handle detalle")
    console.log(dataMermas) 
    const mermaDetalle = await getmerma(dataMermas[0].id_merma)
    navigate('/detalles_merma', { state: mermaDetalle });

    //redirigir a pestaña de detalle
  }

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Mermas</h1>
          <div className='filter-actions'>
            {/* tmp style. la clase esta en users.css*/}
            <button className='create-button' disabled={dataMermas.length === 0} 
              onClick={handleDetalle}>
              {dataMermas.length === 0 ? (
                <img src={InfoIconDisabled} alt="info-disabled" />
              ) : (
                <img src={InfoIcon} alt="Info" />
              )}
            </button>
            <button className='create-button' onClick={handleClickCreate}>
              <img src={CreateIcon} alt="Crear" />
            </button>
            <button className='delete-user-button' disabled={dataMermas.length === 0} 
            onClick={() => handleDelete(dataMermas)}>
              {dataMermas.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={mermas}
          columns={columns}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      {/*<Popup show={isCreatePopUpOpen} setShow={setIsCreatePopUpOpen} data={dataMerma} action={handleCreate} />*/}
    </div>
  );
};
export default Mermas;