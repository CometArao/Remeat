import { useCallback, useEffect, useState } from 'react';
import Table from '@components/Table';
import Search from '@components/Search';
import useGetTiposIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import useCreateTipoIngrediente from '../hooks/tipo_ingrediente/useCreateTipoIngrediente';
import useEditTipoIngrediente from '../hooks/tipo_ingrediente/useEditTipoIngrediente';
import useDeleteTipoIngrediente from '../hooks/tipo_ingrediente/useDeleteTipoIngrediente';
import PopupTipoIngrediente from '@hooks/tipo_ingrediente/PopupTipoIngrediente';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import '@styles/users.css';

const TiposIngrediente = () => {
    const { tiposIngrediente, fetchTiposIngrediente, setTiposIngrediente } = useGetTiposIngrediente();
    const { unidadMedidas, fetchUnidadMedida } = useUnidadMedida();

    useEffect(() => {
        fetchTiposIngrediente();
        fetchUnidadMedida();
    }, []);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataTipoIngrediente: dataTipoIngredienteCreate,
        setDataTipoIngrediente: setDataTipoIngredienteCreate,
    } = useCreateTipoIngrediente(setTiposIngrediente);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataTipoIngrediente,
        setDataTipoIngrediente,
    } = useEditTipoIngrediente(setTiposIngrediente);

    const { handleDelete } = useDeleteTipoIngrediente(fetchTiposIngrediente, setDataTipoIngrediente);

    const handleSelectionChange = useCallback(
        (selectedItems) => {
            if (selectedItems.length > 0) {
                setDataTipoIngrediente(selectedItems);
            } else {
                setDataTipoIngrediente([]);
            }
        },
        [setDataTipoIngrediente]
    );
    

    const columns = [
        { title: 'Nombre', field: 'nombre_tipo_ingrediente', width: 500, responsive: 0 },
        { title: 'Unidad de Medida', field: 'unidad_medida.nombre_unidad_medida', width: 300 },
    ];
    const [searchTerm, setSearchTerm] = useState("");
    // Filtrar datos según el término de búsqueda
    const filteredTiposIngredientes = tiposIngrediente.filter((tipo) =>
        tipo.nombre_tipo_ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Tipos de Ingrediente</h1>
                    <div className="filter-actions">
                        <Search
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    data={filteredTiposIngredientes}
                    columns={columns}
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
