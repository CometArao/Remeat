import useListadoDiarioMenuQr from '../../hooks/MenuQRCode/useListadoDiarioMenuQr';

const ListadoDiarioMenuQrComponent = ({ id_menu }) => {
    const { menu, loading, error } = useListadoDiarioMenuQr(id_menu);

    if (loading) {
        return <p>Cargando menú del día...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!menu || !menu.platillos) {
        return <p>No hay datos disponibles para este menú.</p>;
    }

    return (
        <div className="menu-diario-container">
            <h1>Menú del Día</h1>
            <ul>
                {menu.platillos.map((platillo) => (
                    <li key={platillo.id_platillo} className="platillo-item">
                        <strong>{platillo.nombre_platillo}</strong> - ${platillo.precio_platillo}  
                        {platillo.disponible ? " (Disponible)" : " (No disponible)"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListadoDiarioMenuQrComponent;
