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
import '@styles/pedidos.css';

const Pedidos = () => {
    const navigate = useNavigate();
    const { pedidos, fetchPedidos } = useGetPedidos();
    const { users } = useUsers();
    const { proveedores } = useProveedores();
    const { ingredientes } = useGetIngredientes();
    const { utensilios } = useGetUtensilios();

    const [filterName, setFilterName] = useState('');
    const [dataPedido, setDataPedido] = useState([]);

    const { handleClickUpdate,handleUpdate, isPopupOpen, setIsPopupOpen,} = useEditPedido(fetchPedidos);
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
    }, []);
    

    const handleNameFilterChange = (e) => {
        setFilterName(e.target.value.toLowerCase());
    };

    const handleCardSelectionChange = (selectedPedido) => {
        setDataPedido((prev) => (prev.length > 0 && prev[0].id_pedido === selectedPedido.id_pedido ? [] : [selectedPedido]));
    };

    return (
        <div className="pedido-container">
        <div className="top-pedido-table">
        <h1 className="title-pedido-table">Pedidos</h1>
        <div className="filter-pedido-actions">
    <Search value={filterName} onChange={handleNameFilterChange} placeholder="Buscar por descripción" />
    <button className="create-pedido-button" onClick={() => navigate('/crear_pedido')}>
        <img src={CreateIcon} alt="Crear" />
    </button>
    <button onClick={handleClickUpdate} disabled={dataPedido.length === 0}>
        <img src={dataPedido.length === 0 ? UpdateIconDisable : UpdateIcon} alt="Editar pedido" />
    </button>
    <button onClick={() => handleDelete(dataPedido)} disabled={dataPedido.length === 0}>
        <img src={dataPedido.length === 0 ? DeleteIconDisable : DeleteIcon} alt="Eliminar pedido" />
    </button>
    <button 
        className="confirm-pedido-button" 
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
        <div className="container-pedido">
            {filteredPedidos().map((pedido) => {
                const isSelected = dataPedido.length > 0 && dataPedido[0].id_pedido === pedido.id_pedido;
                return (
                <PedidoCard
                    key={pedido.id_pedido}
                    pedido={pedido}
                    usuarios={users}
                    proveedores={proveedores}
                    isSelected={isSelected}
                    onSelectChange={handleCardSelectionChange}
                    onConfirmar={() => handleConfirmarPedido(pedido.id_pedido)}
                />
            );
        })}
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
