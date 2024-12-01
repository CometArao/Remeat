import { useState, useEffect } from 'react';
import { getUnidadesMedidas } from '@services/unidad_medida.service';

const useUnidadMedida = () => {
    const [unidadMedidas, setUnidadMedida] = useState([]);

    const fetchUnidadMedida = async () => {
        try {
            const response = await getUnidadesMedidas();
            const formattedData = response.map((medida) => ({
                id_unidad_medida: medida.id_unidad_medida,
                nombre_unidad_medida: medida.nombre_unidad_medida,
            }));
            setUnidadMedida(formattedData);
        } catch (error) {
            console.error("Error al obtener unidades de medida:", error);
        }
    };

    useEffect(() => {
        fetchUnidadMedida();
    }, []);

    return { unidadMedidas, fetchUnidadMedida, setUnidadMedida };
};

export default useUnidadMedida;
