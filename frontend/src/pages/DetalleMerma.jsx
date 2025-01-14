import { useLocation } from 'react-router-dom'
import Search from '../components/Search';
import { useCallback, useState, useRef } from 'react';
import { formatearFecha } from '../helpers/formatDate';
import useMerma from '@hooks/mermas/getMerma.jsx';
import { useNavigate } from 'react-router-dom';

const detalleMermas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const merma = location.state;
    //const {merma, fetchMerma, setMerma } = useMerma(id)
    const data = merma;
    console.log("data detalle mermas")
    console.log(merma)
    const [filterName, setFilterName] = useState('');
    const ingredientes = data.ingredientes
    console.log("ingredientes")
    console.log(ingredientes)
    const utensilios = data.utensilios
    console.log(utensilios)
    const handleNameFilterChange = (e) => {
        console.log(e)
        setFilterName(e.target.value.toLowerCase());
    };
    const handleRedirect = () => {
        navigate('/Mermas');
    }
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <button style={{ "margin": "2vh" }} onClick={handleRedirect}>Volver</button>
                    <h1 className='title-table'>Datos de Mermas</h1>
                    <p>Fecha Merma: {data.fecha_merma}</p>
                    <div className='filter-actions'>
                        <Search
                            value={filterName}
                            onChange={handleNameFilterChange}
                            placeholder={'Filtrar por nombre'}
                        />
                    </div>
                </div>
                <div className='horizontal'>
                    <div>
                        <h3>Utensilios</h3>
                        <table border="1" cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha Compra</th>
                                    <th>Cantidad Restante</th>
                                    <th>Cantidad Mermada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {utensilios.map((item) =>
                                    item.nombre_tipo_utensilio.toLowerCase().startsWith(filterName) ? (
                                        <tr key={item.id_utensilio + "-" + data.id_merma}>
                                            <td>
                                                {item.nombre_tipo_utensilio}
                                            </td>
                                            <td>
                                                {formatearFecha(item.fecha_compra_pedido)}
                                            </td>
                                            <td>{item.cantidad_restante_utensilio || 0}</td>
                                            <td>
                                                {item.cantidad_perdida_utensilio}
                                            </td>
                                        </tr>
                                    ) : null
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h3>Ingredientes</h3>
                        <table border="1" cellPadding="10" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha Compra</th>
                                    <th>Cantidad Restante</th>
                                    <th>Cantidad Mermada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredientes.map((item) =>
                                    item.nombre_tipo_ingrediente.toLowerCase().startsWith(filterName) ? (
                                        <tr key={item.id_ingrediente + "-" + data.id_merma}>
                                            <td>
                                                {item.nombre_tipo_ingrediente || "Sin tipo"}
                                            </td>
                                            <td>
                                                {formatearFecha(new Date(item.fecha_compra_pedido)) || "Sin fecha"}
                                            </td>
                                            <td>{item.cantidad_ingrediente || 0}</td>
                                            <td>
                                                {item.cantidad_perdida_ingrediente}
                                            </td>
                                        </tr>
                                    ) : null
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default detalleMermas