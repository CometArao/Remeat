import Table from '@components/Table';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import Popup from '@hooks/unidad_medida/popupUnidadMedida.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import Search from '@components/Search';
import useDeleteUnidadMedida from '@hooks/unidad_medida/useDeleteUnidadMedida';
import useEditUnidadMedida from '@hooks/unidad_medida/useEditUnidadMedida';
import useCreateUnidadMedida from '@hooks/unidad_medida/useCreateUnidadMedida';

const UnidadesMedida = () => {
    const { unidadMedidas, fetchUnidadMedida, setUnidadMedida } = useUnidadMedida();

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

    const [searchTerm, setSearchTerm] = useState("");

     // Filtrar datos según el término de búsqueda
     const filteredUnidadMedidas = unidadMedidas.filter((unidad) =>
        unidad.nombre_unidad_medida.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Unidades de Medida</h1>
                    <div className='filter-actions'>
                        <Search
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Buscar por nombre'
                        />
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
                    data={filteredUnidadMedidas}
                    columns={columns}
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
