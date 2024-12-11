import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '@components/Search';
import PedidoCard from '../components/Pedido/PedidoCard';
import useGetPedidos from '../hooks/pedidos/useGetPedido';
import useUsers from '../hooks/users/useGetUsers';
import useProveedores from '../hooks/proveedores/useGetProveedores';
import useGetIngredientes from '../hooks/ingredientes/useGetIngredientes';
import useGetUtensilios from '../hooks/utensilios/useGetUtensilio';
import PopupPedido from '../hooks/pedidos/popupPedidos';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import CreateIcon from '../assets/PlusIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import EmptyIcon from '../assets/emptyIcon.svg';
import useDeletePedido from '../hooks/pedidos/useDeletePedido';
import useEditPedido from '../hooks/pedidos/useEditPedido';
import useConfirmarPedido from '../hooks/pedidos/useConfirmarPedido';
import '@styles/users.css';

const Pedidos = () => {
    const navigate = useNavigate();
    const { pedidos, fetchPedidos } = useGetPedidos();
    const { users } = useUsers();
    const { proveedores } = useProveedores();
    const { ingredientes } = useGetIngredientes();
    const { utensilios } = useGetUtensilios();

    const [filterName, setFilterName] = useState('');
    const [dataPedido, setDataPedido] = useState([]);
    const [renderKey, setRenderKey] = useState(0); // Para forzar re-renderizaciones necesarias

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
    } = useEditPedido(fetchPedidos);

    const { handleDelete } = useDeletePedido(fetchPedidos, setDataPedido);

    const { handleConfirmarPedido, loading } = useConfirmarPedido(fetchPedidos);

    const filteredPedidos = useCallback(
        () =>
            pedidos.filter((pedido) =>
                pedido.descripcion_pedido.toLowerCase().includes(filterName)
            ),
        [pedidos, filterName]
    );

    useEffect(() => {
        fetchPedidos(); // Llama a la función solo una vez al montar el componente
    }, []); // Dependencias vacías para evitar múltiples llamadas
    

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    const handleCardSelectionChange = useCallback((selectedPedido, isChecked) => {
        setDataPedido((prev) => {
            if (isChecked) {
                if (!prev.some((item) => item.id_pedido === selectedPedido.id_pedido)) {
                    return [...prev, selectedPedido];
                }
            } else {
                return prev.filter((item) => item.id_pedido !== selectedPedido.id_pedido);
            }
            return prev;
        });
    }, []);

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Pedidos</h1>
                    <div className="filter-actions">
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder="Buscar por descripción"
                        />
                        <button className="create-button" onClick={() => navigate('/crear_pedido')}>
                            <img src={CreateIcon} alt="Crear" />
                        </button>
                        <button onClick={handleClickUpdate} disabled={dataPedido.length === 0}>
                            {dataPedido.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                        <button
                            className="delete-user-button"
                            disabled={dataPedido.length === 0}
                            onClick={() => handleDelete(dataPedido)}
                        >
                            {dataPedido.length === 0 ? (
                                <img src={DeleteIconDisable} alt="delete-disabled" />
                            ) : (
                                <img src={DeleteIcon} alt="delete" />
                            )}
                        </button>
                        <button
                            className="confirm-button"
                            onClick={() => handleConfirmarPedido(dataPedido[0]?.id_pedido)}
                            disabled={!dataPedido.length || dataPedido[0]?.estado_pedido === 'Ingresado' || loading}
                        >
                            {loading
                                ? 'Confirmando...'
                                : dataPedido[0]?.estado_pedido === 'Ingresado'
                                ? 'Confirmado'
                                : 'Confirmar'}
                        </button>
                    </div>
                </div>

                {filteredPedidos().length > 0 ? (
                    <div className="container">
                        {filteredPedidos().map((pedido) => (
                            <PedidoCard
                                key={pedido.id_pedido}
                                pedido={pedido}
                                usuarios={users}
                                proveedores={proveedores}
                                isSelected={dataPedido.some((item) => item.id_pedido === pedido.id_pedido)}
                                onSelectChange={handleCardSelectionChange}
                                onConfirmar={() => handleConfirmarPedido(pedido.id_pedido)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-container">
                        <img src={EmptyIcon} alt="No hay pedidos" className="empty-icon" />
                        <h2 className="empty-message">No hay pedidos disponibles</h2>
                        <p className="empty-description">
                            Crea uno nuevo usando el botón <strong>+</strong> en la parte superior.
                        </p>
                    </div>
                )}
            </div>

            <PopupPedido
                show={isPopupOpen}
                setShow={setIsPopupOpen}
                data={dataPedido}
                action={handleUpdate}
                isEdit={true}
                users={users}
                proveedores={proveedores}
                ingredientes={ingredientes}
                utensilios={utensilios}
            />
        </div>
    );
};

export default Pedidos;
