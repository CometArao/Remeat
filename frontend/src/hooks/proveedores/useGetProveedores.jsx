import { useEffect, useState } from 'react';
import { getProveedores } from '@services/proveedores.service.js';

const useProveedores = () => {
    const [proveedores, setProveedores] = useState([]);

    const fetchProveedores = async () => {
        try {
            const response = await getProveedores();
            setProveedores(response);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    return { proveedores, fetchProveedores, setProveedores };
};

export default useProveedores;
