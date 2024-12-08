import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@components/Table';
import useGetPedidos from '../hooks/pedidos/useGetPedido.jsx';
import useUsers from '../hooks/users/useGetUsers.jsx';
import useProveedores from '../hooks/proveedores/useGetProveedores.jsx';
import useGetIngredientes from '../hooks/ingredientes/useGetIngredientes';
import PopupPedido from '../hooks/pedidos/popupPedidos.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from "@assets/updateIconDisabled.svg";
import DeleteIconDisable from "@assets/deleteIconDisabled.svg";
import '@styles/proveedores.css'; // Usaremos este CSS como guía
import useDeletePedido from '../hooks/pedidos/useDeletePedido';
import useEditPedido from '../hooks/pedidos/useEditPedido';
import { useMemo } from 'react';

const Pedidos = () => {
    const navigate = useNavigate();
    const { pedidos, fetchPedidos, setPedidos } = useGetPedidos();
    const { users } = useUsers();
    const { proveedores } = useProveedores();
    const { ingredientes } = useGetIngredientes();

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPedido,
        setDataPedido,
    } = useEditPedido(setPedidos);

    const handleCreateRedirect = () => {
        navigate('/crear_pedido');
    };

    const { handleDelete } = useDeletePedido(fetchPedidos, setDataPedido);

    const handleSelectionChange = useCallback(
        (selectedItems) => {
            setDataPedido(selectedItems);
        },
        [setDataPedido]
    );

    const columns = [
        { title: 'ID', field: 'id_pedido', width: 100 },
        { title: 'Descripción', field: 'descripcion_pedido', width: 200 },
        { title: 'Fecha de Compra', field: 'fecha_compra_pedido', width: 150 },
        { title: 'Fecha de Entrega', field: 'fecha_entrega_pedido', width: 150 },
        { title: 'Costo', field: 'costo_pedido', width: 100 },
        { title: 'Estado', field: 'estado_pedido', width: 100 },
        { title: 'Usuario', field: 'nombre_usuario', width: 200 },
        { title: 'Proveedor', field: 'nombre_proveedor', width: 200 },
    ];

    const pedidosConNombres = useMemo(() => {
        return pedidos.map((pedido) => {
            const usuario = users.find((u) => u.id_usuario === pedido.id_usuario);
            const proveedor = proveedores.find((p) => p.id_proveedor === pedido.id_proveedor);
            return {
                ...pedido,
                id: pedido.id_pedido,
                nombre_usuario: usuario ? `${usuario.nombre_usuario} ${usuario.apellido_usuario}` : 'N/A',
                nombre_proveedor: proveedor ? proveedor.nombre_proveedor : 'N/A',
            };
        });
    }, [pedidos, users, proveedores]);

    return (
        <div className="proveedores-container">
            <div className="proveedores-table-container">
                <div className="proveedores-top-table">
                    <h1 className="proveedores-title-table">Pedidos</h1>
                    <div className="proveedores-filter-actions">
                        {/* Botón Crear Pedido - Redirige a una nueva pantalla */}
                        <button
                            className="proveedores-create-button"
                            onClick={handleCreateRedirect}
                        >
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        {/* Botón Editar Pedido */}
                        <button
                            onClick={handleClickUpdate}
                            disabled={dataPedido.length === 0}
                        >
                            <img
                                src={
                                    dataPedido.length === 0 ? UpdateIconDisable : UpdateIcon
                                }
                                alt="Editar Pedido"
                            />
                        </button>
                        {/* Botón Eliminar Pedido */}
                        <button
                            className="proveedores-delete-button"
                            disabled={dataPedido.length === 0}
                            onClick={() => handleDelete(dataPedido)}
                        >
                            <img
                                src={
                                    dataPedido.length === 0 ? DeleteIconDisable : DeleteIcon
                                }
                                alt="Eliminar Pedido"
                            />
                        </button>
                    </div>
                </div>
                <Table
                    data={pedidosConNombres}
                    columns={columns}
                    initialSortName={'fecha_compra_pedido'}
                    onSelectionChange={handleSelectionChange}
                    idField="id" // Importante para que la tabla use la propiedad 'id' como identificador
                />
            </div>

            {/* Popup para Editar Pedido */}
            <PopupPedido
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataPedido}
                action={handleUpdate}
                isEdit={true}
                users={users}
                proveedores={proveedores}
                ingredientes={ingredientes}
            />
        </div>
    );
};

export default Pedidos;
