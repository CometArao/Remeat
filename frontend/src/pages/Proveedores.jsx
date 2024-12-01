import Table from '@components/Table';
import useProveedores from '../hooks/proveedores/useGetProveedores';
import PopupFormProveedores from '../hooks/proveedores/popupFormProveedores';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import { useCallback, useState } from 'react';
import '@styles/proveedores.css'; // Cambiado para que use un estilo exclusivo
import useDeleteProveedor from '../hooks/proveedores/useDeleteProveedores';
import useEditProveedor from '../hooks/proveedores/useEditProveedores';
import useCreateProveedor from '../hooks/proveedores/useCreateProveedores';

const Proveedores = () => {
  const { proveedores, fetchProveedores, setProveedores } = useProveedores();
  const [filter, setFilter] = useState('');

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataProveedor,
    setDataProveedor,
  } = useEditProveedor(setProveedores, fetchProveedores);

  const { handleDelete } = useDeleteProveedor(fetchProveedores, setDataProveedor);

  const handleSelectionChange = useCallback(
    (selectedItems) => {
      setDataProveedor(selectedItems);
    },
    [setDataProveedor]
  );

  const {
    handleClickCreate,
    handleCreate,
    isCreatePopUpOpen,
    setIsCreatePopUpOpen,
    dataProveedorCreate,
    setDataProveedorCreate,
  } = useCreateProveedor(setProveedores);

  const columns = [
    { title: 'Nombre', field: 'nombre_proveedor', width: 200 },
    { title: 'Tipo', field: 'tipo_proveedor', width: 200 },
    { title: 'Correo', field: 'correo_proveedor', width: 300 },
  ];

  return (
    <div className="proveedores-container">
      <div className="proveedores-table-container">
        <div className="proveedores-top-table">
          <h1 className="proveedores-title-table">Proveedores</h1>
          <div className="proveedores-filter-actions">
            <button className="proveedores-create-button" onClick={handleClickCreate}>
              <img src={CreateIcon} alt="Crear" />
            </button>
            <button
              className="proveedores-edit-button"
              onClick={handleClickUpdate}
              disabled={dataProveedor.length === 0}
            >
              <img src={UpdateIcon} alt="Editar" />
            </button>
            <button
              className="proveedores-delete-button"
              disabled={dataProveedor.length === 0}
              onClick={() => handleDelete(dataProveedor)}
            >
              <img src={DeleteIcon} alt="Eliminar" />
            </button>
          </div>
        </div>
        <Table
          data={proveedores}
          columns={columns}
          filter={filter}
          dataToFilter={'nombre_proveedor'}
          initialSortName={'nombre_proveedor'}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupFormProveedores
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataProveedor}
        action={handleUpdate}
        isEdit={true} // Es una edición
      />

      <PopupFormProveedores
        show={isCreatePopUpOpen}
        setShow={setIsCreatePopUpOpen}
        data={dataProveedorCreate}
        action={handleCreate}
        isEdit={false} // Es una creación
      />

    </div>
  );
};

export default Proveedores;
