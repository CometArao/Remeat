import '@styles/ListadoMenuQR.css';

const ListadoDiarioMenuQrComponent = ({ menuData }) => {
    if (!menuData) {
        return <p className="menu-qr-error">Error: Datos del menú no disponibles.</p>;
    }

    return (
        <div className="menu-qr-container">
            <h2 className="menu-qr-title">Menú del Día</h2>
            <p className="menu-qr-date">Fecha: {menuData.fecha}</p>
            <p className="menu-qr-availability">
                Disponibilidad: {menuData.disponibilidad ? 'Disponible' : 'No Disponible'}
            </p>
            <h3 className="menu-qr-subtitle">Platillos:</h3>
            <ul className="menu-qr-list">
                {menuData.platillo.map((platillo) => (
                    <li key={platillo.id_platillo} className="menu-qr-item">
                        {platillo.nombre_platillo} - ${platillo.precio_platillo} -{' '}
                        {platillo.disponible ? (
                            <span className="menu-qr-available">Disponible</span>
                        ) : (
                            <span className="menu-qr-unavailable">No Disponible</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListadoDiarioMenuQrComponent;
