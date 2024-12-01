import { useCallback, useEffect, useState } from 'react';
import Table from '@components/Table';
import Search from '@components/Search';
import useGetTiposIngrediente from '../hooks/tipo_ingrediente/useGetTiposIngredientes';
import useGetIngredientes from '../hooks/ingredientes/useGetIngredientes';
import useCreateIngrediente from '../hooks/ingredientes/useCreateIngredientes';
import useEditIngrediente from '../hooks/ingredientes/useEditIngredientes';
import useDeleteIngrediente from '../hooks/ingredientes/useDeletedIngredientes';
import PopupIngrediente from '../hooks/ingredientes/PopupIngrediente';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import '@styles/users.css';

const Ingredientes = () => {
    const { ingredientes, fetchIngredientes, setIngredientes } = useGetIngredientes();
    const { tiposIngrediente, fetchTiposIngrediente } = useGetTiposIngrediente();

    useEffect(() => {
        fetchIngredientes();
        fetchTiposIngrediente();
    }
    , []);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataIngrediente: dataIngredienteCreate,
        setDataIngrediente: setDataIngredienteCreate,
    } = useCreateIngrediente(setIngredientes);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataIngrediente,
        setDataIngrediente,
    } = useEditIngrediente(setIngredientes);

    const { handleDelete } = useDeleteIngrediente(fetchIngredientes, setDataIngrediente);

    const handleSelectionChange = useCallback(
        (selectedItems) => {
            if (selectedItems.length > 0) {
                setDataIngrediente(selectedItems);
            } else {
                setDataIngrediente([]);
            }
        },
        [setDataIngrediente]
    );

    const columns = [
      { title: 'Fecha de Vencimiento', field: 'fecha_vencimiento', width: 200 },
      { title: 'Cantidad', field: 'cantidad_ingrediente', width: 150 },
      { title: 'Cantidad Original', field: 'cantidad_original_ingrediente', width: 200 },
      { title: 'Costo', field: 'costo_ingrediente', width: 150 },
      { title: 'Tipo de Ingrediente', field: 'tipo_ingrediente.nombre_tipo_ingrediente', width: 200 },
    ];
  const [searchTerm, setSearchTerm] = useState("");
  
     // Filtrar ingredientes por término de búsqueda en nombre_tipo_ingrediente
     const filteredIngredientes = ingredientes.filter((ingrediente) =>
        ingrediente.tipo_ingrediente.nombre_tipo_ingrediente
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Ingredientes</h1>
                    <div className="filter-actions">
                        <Search
                            value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por tipo de ingrediente"
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
                    data={filteredIngredientes}
                    columns={columns}
                    initialSortName="nombre_tipo_ingrediente"
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
