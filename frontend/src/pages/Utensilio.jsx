import Table from '@components/Table';
import Search from '@components/Search';
import useGetTiposUtensilio from '../hooks/tipo_utensilio/useGetTipoUtensilio';
import useGetUtensilios from '../hooks/utensilios/useGetUtensilio';
import PopupUtensilio from '../hooks/utensilios/popupUtensilio';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useEffect, useState } from 'react';
import useDeleteUtensilio from '../hooks/utensilios/useDeleteUtensilio';
import useEditUtensilio from '../hooks/utensilios/useEditUtensilio';
import useCreateUtensilio from '../hooks/utensilios/useCreateUtensilio';
import '@styles/users.css';

const Utensilios = () => {
    const { utensilios, fetchUtensilios, setUtensilios } = useGetUtensilios();
    const { tipoUtensilios, fetchTipoUtensilio } = useGetTiposUtensilio();
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        fetchUtensilios();
        fetchTipoUtensilio();
    }, []);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUtensilio,
        setDataUtensilio,
    } = useEditUtensilio(setUtensilios);

    const { handleDelete } = useDeleteUtensilio(fetchUtensilios, setDataUtensilio);

    const handleSelectionChange = useCallback((selectedItems) => {
        setDataUtensilio(selectedItems);
    }, [setDataUtensilio]);

    const {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataUtensilioCreate,
        setDataUtensilioCreate,
    } = useCreateUtensilio(setUtensilios);

    const columns = [
        { title: 'Cantidad', field: 'cantidad_utensilio', width: 150 },
        { title: 'Costo', field: 'costo_utensilio', width: 150 },
        { title: 'Tipo de Utensilio', field: 'tipo_utensilio.nombre_tipo_utensilio', width: 200 },
    ];

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Utensilios</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por tipo de utensilio"
                        />
                        <button className="create-button" onClick={handleClickCreate}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataUtensilio.length === 0}>
                            <img
                                src={
                                    dataUtensilio.length === 0 ? UpdateIconDisable : UpdateIcon
                                }
                                alt="edit"
                            />
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataUtensilio.length === 0}
                            onClick={() => handleDelete(dataUtensilio)}
                        >
                            <img
                                src={
                                    dataUtensilio.length === 0 ? DeleteIconDisable : DeleteIcon
                                }
                                alt="delete"
                            />
                        </button>
                    </div>
                </div>
                <Table
                    data={utensilios}
                    columns={columns}
                    filter={filterName}
                    dataToFilter="tipo_utensilio.nombre_tipo_utensilio"
                    initialSortName="tipo_utensilio.nombre_tipo_utensilio"
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <PopupUtensilio
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataUtensilio}
                action={handleUpdate}
                tiposUtensilio={tipoUtensilios}
                isEdit={true}
            />
            <PopupUtensilio
                show={isCreatePopupOpen}
                setShow={setIsCreatePopupOpen}
                data={dataUtensilioCreate}
                action={handleCreate}
                tiposUtensilio={tipoUtensilios}
                isEdit={false}
            />
        </div>
    );
};

export default Utensilios;
