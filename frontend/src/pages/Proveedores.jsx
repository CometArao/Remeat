import Table from "@components/Table";
import useProveedores from "../hooks/proveedores/useGetProveedores";
import PopupFormProveedores from "../hooks/proveedores/popupFormProveedores";
import DeleteIcon from "../assets/deleteIcon.svg";
import UpdateIcon from "../assets/updateIcon.svg";
import CreateIcon from "../assets/PlusIcon.svg";
import UpdateIconDisable from "@assets/updateIconDisabled.svg";
import DeleteIconDisable from "@assets/deleteIconDisabled.svg";
import { useCallback, useState } from "react";
import "@styles/proveedores.css"; // Cambiado para que use un estilo exclusivo
import useDeleteProveedor from "../hooks/proveedores/useDeleteProveedores";
import useEditProveedor from "../hooks/proveedores/useEditProveedores";
import useCreateProveedor from "../hooks/proveedores/useCreateProveedores";

const Proveedores = () => {
  const { proveedores, fetchProveedores, setProveedores } = useProveedores();
  const [filter, setFilter] = useState("");

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataProveedor,
    setDataProveedor,
  } = useEditProveedor(setProveedores, fetchProveedores);

  const { handleDelete } = useDeleteProveedor(
    fetchProveedores,
    setDataProveedor
  );

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
    { title: "ID", field: "id_proveedor", width: 100 },
    { title: "Nombre", field: "nombre_proveedor", width: 200 },
    { title: "Tipo", field: "tipo_proveedor", width: 200 },
    { title: "Correo", field: "correo_proveedor", width: 300 },
  ];

  return (
    <div className="proveedores-container">
      <div className="proveedores-table-container">
        <div className="proveedores-top-table">
          <h1 className="proveedores-title-table">Proveedores</h1>
          <div className="proveedores-filter-actions">
            <button
              className="proveedores-create-button"
              onClick={handleClickCreate}
            >
              <img src={CreateIcon} alt="Crear" />
            </button>
            {/* Botón Editar Proveedor */}
            <button
              onClick={handleClickUpdate}
              disabled={dataProveedor.length === 0}
            >
              <img
                src={
                  dataProveedor.length === 0 ? UpdateIconDisable : UpdateIcon
                }
                alt="Editar Proveedor"
              />
            </button>
            {/* Botón Eliminar Usuario */}
            <button className='delete-user-button' disabled={dataProveedor.length === 0} onClick={() => handleDelete(dataProveedor)}>
              {dataProveedor.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
              </button>
          </div>
        </div>
        <Table
          data={proveedores}
          columns={columns}
          filter={filter}
          dataToFilter={"nombre_proveedor"}
          initialSortName={"id_proveedor"}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <PopupFormProveedores
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataProveedor}
        action={handleUpdate}
        isEdit={true}
      />

      <PopupFormProveedores
        show={isCreatePopUpOpen}
        setShow={setIsCreatePopUpOpen}
        data={dataProveedorCreate}
        action={handleCreate}
        isEdit={false}
      />
    </div>
  );
};

export default Proveedores;
