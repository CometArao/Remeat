import { useState, useEffect } from 'react';
import { fetchListadoDiarioMenuQr } from '../../services/listadoDiarioMenuQr.service';

const useListadoDiarioMenuQr = (id_menu) => {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMenu = async () => {
            setLoading(true);
            try {
                const data = await fetchListadoDiarioMenuQr(id_menu);
                setMenu(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id_menu) {
            getMenu();
        }
    }, [id_menu]);

    return { menu, loading, error };
};

export default useListadoDiarioMenuQr;
