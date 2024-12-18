import { useSearchParams } from 'react-router-dom';
import ListadoDiarioMenuQrComponent from '../../src/components/MenuQRCode/ListadoDiarioMenuQrComponent';


const ListadoDiarioMenuQrPage = () => {
    const [searchParams] = useSearchParams();
    const menuDataEncoded = searchParams.get('menuData');

    if (!menuDataEncoded) {
        return <p>Error: No se proporcionaron datos del menú.</p>;
    }

    let menuData;
    try {

        menuData = JSON.parse(atob(menuDataEncoded));
    } catch (error) {
        console.error("Error al decodificar los datos del menú:", error);
        return <p>Error: Datos del menú inválidos.</p>;
    }

    return (
        <div>
            <ListadoDiarioMenuQrComponent menuData={menuData} />
        </div>
    );
};

export default ListadoDiarioMenuQrPage;
