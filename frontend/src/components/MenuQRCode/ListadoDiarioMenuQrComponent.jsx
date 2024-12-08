import { useSearchParams } from 'react-router-dom';
import ListadoDiarioMenuQrComponent from '../MenuQRCode/ListadoDiarioMenuQrComponent';

const ListadoDiarioMenuQrPage = () => {
    const [searchParams] = useSearchParams();
    const menuDataEncoded = searchParams.get('menuData'); // Extrae el menú codificado

    if (!menuDataEncoded) {
        return <p>Error: No se proporcionaron datos del menú.</p>;
    }

    // Decodificar los datos del menú
    const menuData = JSON.parse(atob(menuDataEncoded));

    return (
        <div>
            <ListadoDiarioMenuQrComponent menuData={menuData} />
        </div>
    );
};

export default ListadoDiarioMenuQrPage;
