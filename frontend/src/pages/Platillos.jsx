import Search from '@components/Search';
import Table from '@components/Table';
import useTipoIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetPlatillos from '../hooks/platillos/useGetPlatillos';
import PopupPlatillo from '@hooks/platillos/popupPlatillo';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useEffect, useState } from 'react';
import '@styles/users.css';
import useDeletePlatillo from '../hooks/platillos/useDeletePlatillo';
import useEditPlatillo from '../hooks/platillos/useEditPlatillo';
import useCreatePlatillo from '../hooks/platillos/useCreatePlatillo';

const Platillos = () => {
    const { platillo, fetchPlatillo, setPlatillo } = useGetPlatillos();
    const { tiposIngrediente, fetchTiposIngrediente } = useTipoIngrediente();

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchPlatillo();
        fetchTiposIngrediente();
    }, []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPlatillo,
        setDataPlatillo,
    } = useEditPlatillo(setPlatillo);

    const { handleDelete } = useDeletePlatillo(fetchPlatillo, setDataPlatillo);

    const handleSelectionChange = useCallback((selectedItems) => {
        setDataPlatillo(selectedItems);
      }, [setDataPlatillo]);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataPlatilloCreate,
        setDataPlatilloCreate,
    } = useCreatePlatillo(setPlatillo);

    const columns = [
        { title: 'Nombre', field: 'nombre_platillo', width: 500, responsive: 0 },
        { title: 'Ingredientes', field: 'tipo_ingrediente.nombre_tipo_ingrediente', width: 300 },
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
                    <h1 className="title-table">Platillos</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por nombre"
                        />
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataPlatillo.length === 0}>
                            {dataPlatillo.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataPlatillo.length === 0}
                            onClick={() => handleDelete(dataPlatillo)}
                        >
                            {dataPlatillo.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>
                <Table
                    data={platillo}
                    columns={columns}
                    filter={filterName}
                    dataToFilter={'nombre_tipo_ingrediente'}
                    initialSortName="nombre_tipo_ingrediente"
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <PopupPlatillo
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataPlatillo}
                action={handleUpdate}
                unidadesMedida={tiposIngrediente}
                isEdit = {true}
            />
            <PopupPlatillo
                show={isCreatePopupOpen}
                setShow={setIsCreatePopupOpen}
                data={dataPlatilloCreate}
                action={handleCreate}
                unidadesMedida={tiposIngrediente}
                isEdit = {false}
            />
        </div>
    );
};

export default Platillos;