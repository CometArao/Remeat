import Search from '@components/Search';
import Table from '@components/Table';
import useGetTiposIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetIngredientes from '../hooks/ingredientes/useGetIngredientes';
import PopupIngrediente from '../hooks/ingredientes/PopupIngrediente';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import '@styles/users.css';
import { useCallback, useEffect, useState } from 'react';
import useDeleteIngrediente from '../hooks/ingredientes/useDeletedIngredientes';
import useEditIngrediente from '../hooks/ingredientes/useEditIngredientes';
import useCreateIngrediente from '../hooks/ingredientes/useCreateIngredientes';

const Ingredientes = () => {
    const { ingredientes, fetchIngredientes, setIngredientes } = useGetIngredientes();
    const { tiposIngrediente, fetchTiposIngrediente } = useGetTiposIngrediente();

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchIngredientes();
        fetchTiposIngrediente();
    }
    , []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataIngrediente,
        setDataIngrediente,
    } = useEditIngrediente(setIngredientes);
    
    const { handleDelete } = useDeleteIngrediente(fetchIngredientes, setDataIngrediente);

    const handleSelectionChange = useCallback((selectedItems) => {
        setDataIngrediente(selectedItems);
      }, [setDataIngrediente]);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataIngredienteCreate,
        setDataIngredienteCreate,
    } = useCreateIngrediente(setIngredientes);

    const columns = [
      {title: 'ID', field: 'id_ingrediente', width: 100},  
      { title: 'Fecha de Vencimiento', field: 'fecha_vencimiento', width: 200 },
      { title: 'Cantidad', field: 'cantidad_ingrediente', width: 150 },
      { title: 'Cantidad Original', field: 'cantidad_original_ingrediente', width: 200 },
      { title: 'Costo', field: 'costo_ingrediente', width: 150 },
      { title: 'Tipo de Ingrediente', field: 'tipo_ingrediente.nombre_tipo_ingrediente', width: 200 },
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
                    <h1 className="title-table">Ingredientes</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por nombre de ingrediente"
                        />
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataIngrediente.length === 0}>
                            {dataIngrediente.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataIngrediente.length === 0}
                            onClick={() => handleDelete(dataIngrediente)}
                        >
                            {dataIngrediente.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                    </div>
                </div>
                <Table
                    data={ingredientes}
                    columns={columns}
                    filter={filterName}
                    dataToFilter={'tipo_ingrediente.nombre_tipo_ingrediente'}
                    initialSortName="tipo_ingrediente.nombre_tipo_ingrediente"
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <PopupIngrediente
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataIngrediente}
                action={handleUpdate}
                tiposIngrediente={tiposIngrediente}
                isEdit={true}
            />
            <PopupIngrediente
                show={isCreatePopupOpen}
                setShow={setIsCreatePopupOpen}
                data={dataIngredienteCreate}
                action={handleCreate}
                tiposIngrediente={tiposIngrediente}
                isEdit={false}
            />
        </div>
    );
};

export default Ingredientes;