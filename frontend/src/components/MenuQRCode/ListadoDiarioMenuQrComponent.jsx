const ListadoDiarioMenuQrComponent = ({ menuData }) => {
    if (!menuData) {
        return <p>Error: Datos del menú no disponibles.</p>;
    }

    return (
        <div>
            <h2>Menú del Día</h2>
            <p>Fecha: {menuData.fecha}</p>
            <p>Disponibilidad: {menuData.disponibilidad ? 'Disponible' : 'No Disponible'}</p>
            <h3>Platillos:</h3>
            <ul>
                {menuData.platillos.map((platillo) => (
                    <li key={platillo.id_platillo}>
                        {platillo.nombre_platillo} - ${platillo.precio_platillo} -{' '}
                        {platillo.disponible ? 'Disponible' : 'No Disponible'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListadoDiarioMenuQrComponent;
