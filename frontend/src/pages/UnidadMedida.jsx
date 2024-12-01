import Table from '@components/Table';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import Popup from '@hooks/unidad_medida/popupUnidadMedida.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useDeleteUnidadMedida from '@hooks/unidad_medida/useDeleteUnidadMedida';
import useEditUnidadMedida from '@hooks/unidad_medida/useEditUnidadMedida';
import useCreateUnidadMedida from '@hooks/unidad_medida/useCreateUnidadMedida';

const UnidadesMedida = () => {
    const { unidadMedidas, fetchUnidadMedida, setUnidadMedida } = useUnidadMedida();
    const [filterRut, setFilterRut] = useState('');

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUnidadMedida,
        setDataUnidadMedida,
    } = useEditUnidadMedida(setUnidadMedida);

    const { handleDelete } = useDeleteUnidadMedida(fetchUnidadMedida, setDataUnidadMedida);

    const handleSelectionChange = useCallback(
        (selectedItems) => setDataUnidadMedida(selectedItems),
        [setDataUnidadMedida]
    );

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
        dataUnidadMedidaCreate,
        setDataUnidadMedidaCreate,
    } = useCreateUnidadMedida(setUnidadMedida);

    const columns = [{ title: 'Nombre', field: 'nombre_unidad_medida', width: 500, responsive: 0 }];

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Unidades de Medida</h1>
                    <div className='filter-actions'>
                        <button className='create-button' onClick={handleClickCreate}>
                            <img src={CreateIcon} alt='Crear' />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataUnidadMedida.length === 0}>
                            <img src={UpdateIcon} alt='Editar' />
                        </button>
                        <button
                            className='delete-user-button'
                            disabled={dataUnidadMedida.length === 0}
                            onClick={() => handleDelete(dataUnidadMedida)}
                        >
                            <img src={DeleteIcon} alt='Eliminar' />
                        </button>
                    </div>
                </div>
                <Table
                    data={unidadMedidas}
                    columns={columns}
                    filter={filterRut}
                    initialSortName='nombre_unidad_medida'
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <Popup
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataUnidadMedida}
                action={handleUpdate}
            />
            <Popup
                show={isCreatePopUpOpen}
                setShow={setIsCreatePopUpOpen}
                data={dataUnidadMedidaCreate}
                action={handleCreate}
            />
        </div>
    );
};

export default UnidadesMedida;
