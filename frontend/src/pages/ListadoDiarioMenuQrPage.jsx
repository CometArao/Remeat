import { useParams, useSearchParams } from 'react-router-dom';
import ListadoDiarioMenuQrComponent from '../../src/components/MenuQRCode/ListadoDiarioMenuQrComponent';

const ListadoDiarioMenuQrPage = () => {
    const { id_menu: idMenuParam } = useParams(); // Extrae el ID del menú de un parámetro dinámico
    const [searchParams] = useSearchParams();
    const idMenuQuery = searchParams.get('id_menu'); // Extrae el ID del menú de los query params

    // Usar el ID del menú del path param o del query param
    const id_menu = idMenuParam || idMenuQuery;

    // Mostrar un mensaje si no hay un ID de menú
    if (!id_menu) {
        return <p>Por favor, proporciona un ID de menú válido o escanea un QR.</p>;
    }

    return (
        <div>
            <ListadoDiarioMenuQrComponent id_menu={id_menu} />
        </div>
    );
};

export default ListadoDiarioMenuQrPage;
