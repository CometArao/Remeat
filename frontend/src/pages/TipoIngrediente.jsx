import Search from '@components/Search';
import Table from '@components/Table';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import useGetTiposIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import PopupTipoIngrediente from '@hooks/tipo_ingrediente/popupTipoIngrediente';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useEffect, useState } from 'react';
import '@styles/users.css';
import useDeleteTipoIngrediente from '../hooks/tipo_ingrediente/useDeleteTipoIngrediente';
import useEditTipoIngrediente from '../hooks/tipo_ingrediente/useEditTipoIngrediente';
import useCreateTipoIngrediente from '../hooks/tipo_ingrediente/useCreateTipoIngrediente';

const TiposIngrediente = () => {
    const { tiposIngrediente, fetchTiposIngrediente, setTiposIngrediente } = useGetTiposIngrediente();
    const { unidadMedidas, fetchUnidadMedida } = useUnidadMedida();

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchTiposIngrediente();
        fetchUnidadMedida();
    }, []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataTipoIngrediente,
        setDataTipoIngrediente,
    } = useEditTipoIngrediente(setTiposIngrediente,fetchTiposIngrediente);

    const { handleDelete } = useDeleteTipoIngrediente(fetchTiposIngrediente, setDataTipoIngrediente);

    const handleSelectionChange = useCallback((selectedItems) => {
        setDataTipoIngrediente(selectedItems);
      }, [setDataTipoIngrediente]);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataTipoIngredienteCreate,
        setDataTipoIngredienteCreate,
    } = useCreateTipoIngrediente(setTiposIngrediente);

    const columns = [
        { title: 'ID', field: 'id_tipo_ingrediente', width: 100 },
        { title: 'Nombre', field: 'nombre_tipo_ingrediente', width: 500, responsive: 0 },
        { title: 'Unidad de Medida', field: 'unidad_medida.nombre_unidad_medida', width: 300 },
        { title: 'Cantidad alerta', field: 'cantidad_alerta_tipo_ingrediente', width: 200 },
    ];
    
    // Filtrar datos según el término de búsqueda
    const handleNameFilterChange = (e) => {
        console.log(e)
        setFilterName(e.target.value.toLowerCase());
      };


    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Tipos de Ingrediente</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por nombre"
                        />
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataTipoIngrediente.length === 0}>
                            {dataTipoIngrediente.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataTipoIngrediente.length === 0}
                            onClick={() => handleDelete(dataTipoIngrediente)}
                        >
                            {dataTipoIngrediente.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>
                <Table
                    data={tiposIngrediente}
                    columns={columns}
                    filter={filterName}
                    dataToFilter={'nombre_tipo_ingrediente'}
                    initialSortName="nombre_tipo_ingrediente"
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <PopupTipoIngrediente
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataTipoIngrediente}
                action={handleUpdate}
                unidadesMedida={unidadMedidas}
                isEdit = {true}
            />
            <PopupTipoIngrediente
                show={isCreatePopupOpen}
                setShow={setIsCreatePopupOpen}
                data={dataTipoIngredienteCreate}
                action={handleCreate}
                unidadesMedida={unidadMedidas}
                isEdit = {false}
            />
        </div>
    );
};

export default TiposIngrediente;