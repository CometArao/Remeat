import Table from '@components/Table';
import useUnidadMedida from '../hooks/unidad_medida/useGetUnidadMedida';
import PopupFormUnidadMedida from '../hooks/unidad_medida/popupUnidadMedida.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import { useCallback, useState } from 'react';
import '@styles/unidades_medida.css'; // Usa el nuevo estilo
import useDeleteUnidadMedida from '../hooks/unidad_medida/useDeleteUnidadMedida';
import useEditUnidadMedida from '../hooks/unidad_medida/useEditUnidadMedida';
import useCreateUnidadMedida from '../hooks/unidad_medida/useCreateUnidadMedida';

const UnidadesMedida = () => {
  const { unidadMedidas, fetchUnidadMedida, setUnidadMedida } = useUnidadMedida();
  const [filter, setFilter] = useState('');

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUnidadMedida,
    setDataUnidadMedida,
  } = useEditUnidadMedida(setUnidadMedida, fetchUnidadMedida);

  const { handleDelete } = useDeleteUnidadMedida(fetchUnidadMedida, setDataUnidadMedida);

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setDataUnidadMedida(selectedItems);
    },
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

  const columns = [
    { title: 'Nombre', field: 'nombre_unidad_medida', width: 500 },
  ];

  return (
    <div className="unidades-container">
      <div className="unidades-table-container">
        <div className="unidades-top-table">
          <h1 className="unidades-title-table">Unidades de Medida</h1>
          <div className="unidades-filter-actions">
            <input
              type="text"
              className="unidades-search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por nombre"
            />
            <button className="unidades-create-button" onClick={handleClickCreate}>
              <img src={CreateIcon} alt="Crear" />
            </button>
            <button
              className="unidades-edit-button"
              onClick={handleClickUpdate}
              disabled={dataUnidadMedida.length === 0}
            >
              <img src={UpdateIcon} alt="Editar" />
            </button>
            <button
              className="unidades-delete-button"
              disabled={dataUnidadMedida.length === 0}
              onClick={() => handleDelete(dataUnidadMedida)}
            >
              <img src={DeleteIcon} alt="Eliminar" />
            </button>
          </div>
        </div>
        <Table
          data={unidadMedidas}
          columns={columns}
          filter={filter}
          dataToFilter={'nombre_unidad_medida'}
          initialSortName={'nombre_unidad_medida'}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupFormUnidadMedida
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataUnidadMedida}
        action={handleUpdate}
        isEdit={true} // Es una edición
      />

      <PopupFormUnidadMedida
        show={isCreatePopUpOpen}
        setShow={setIsCreatePopUpOpen}
        data={dataUnidadMedidaCreate}
        action={handleCreate}
        isEdit={false} // Es una creación
      />
    </div>
  );
};

export default UnidadesMedida;
