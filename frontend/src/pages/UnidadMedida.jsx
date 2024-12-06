import Search from '@components/Search';
import Table from '@components/Table';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import Popup from '@hooks/unidad_medida/popupUnidadMedida.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useDeleteUnidadMedida from '@hooks/unidad_medida/useDeleteUnidadMedida';
import useEditUnidadMedida from '@hooks/unidad_medida/useEditUnidadMedida';
import useCreateUnidadMedida from '@hooks/unidad_medida/useCreateUnidadMedida';

const UnidadesMedida = () => {
    const { unidadMedidas, fetchUnidadMedida, setUnidadMedida } = useUnidadMedida();

    const [filterName, setFilterName] = useState('');

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUnidadMedida,
        setDataUnidadMedida,
    } = useEditUnidadMedida(setUnidadMedida);

    const { handleDelete } = useDeleteUnidadMedida(fetchUnidadMedida, setDataUnidadMedida);

    const handleSelectionChange = useCallback((selectedItems) => {
      setDataUnidadMedida(selectedItems);
    }, [setDataUnidadMedida]);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataUnidadMedidaCreate,
        setDataUnidadMedidaCreate,
    } = useCreateUnidadMedida(setUnidadMedida);

    const columns = [{ title: 'Nombre', field: 'nombre_unidad_medida', width: 500, responsive: 0 }];

    const handleNameFilterChange = (e) => {
      console.log(e)
      setFilterName(e.target.value.toLowerCase());
    };

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Unidades de Medida</h1>
                    <div className='filter-actions'>
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder='Filtrar por nombre'
                        />
                        <button className='create-button' onClick={handleClickCreate}>
                            <img src={CreateIcon} alt='Crear' />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataUnidadMedida.length === 0}>
                          {dataUnidadMedida.length === 0 ? (
                            <img src = {UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                              <img src = {UpdateIcon} alt="edit" />
                          )}
                        </button>
                        <button className='delete-user-button' disabled={dataUnidadMedida.length === 0} onClick={() => handleDelete(dataUnidadMedida)}>
                          {dataUnidadMedida.length === 0 ? (
                            <img src={DeleteIconDisable} alt="delete-disabled" />
                          ) : (
                            <img src={DeleteIcon} alt="delete" />
                          )}
                          </button>
                    </div>
                </div>
                <Table
                    data={unidadMedidas}
                    columns={columns}
                    filter={filterName}
                    dataToFilter={'nombre_unidad_medida'}
                    initialSortName='nombre_unidad_medida'
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <Popup
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataUnidadMedida}
                action={handleUpdate}
                isEdit = {true}
            />
            <Popup
                show={isCreatePopUpOpen}
                setShow={setIsCreatePopUpOpen}
                data={dataUnidadMedidaCreate}
                action={handleCreate}
                isEdit = {false}
            />
        </div>
    );
};

export default UnidadesMedida;
