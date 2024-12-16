import { useEffect, useState } from 'react';
import { getIngredientes } from '@services/ingredientes.service';
import { useNavigate } from 'react-router-dom'; // Importar navigate
import { formatDateDMY } from '../../../../backend/src/utils/dateUtils.js';

const useGetIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Inicializa navigate

    const fetchIngredientes = async () => {
        try {
            const data = await getIngredientes();

            if (Array.isArray(data)) {
                // Formatear las fechas antes de establecer el estado
                const formattedData = data.map((ingrediente) => ({
                    ...ingrediente,
                    fecha_vencimiento: formatDateDMY(ingrediente.fecha_vencimiento),
                }));

                setIngredientes(formattedData);
            } else {
                console.error("Error fetching ingredientes: ", data);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                console.warn("Acceso denegado: fuera de horario laboral.");
                navigate('/fuera-horario'); // Redirigir directamente
            } else {
                setError("Error al obtener los ingredientes.");
                console.error("Error fetching ingredientes:", error);
            }
        }
    };

    useEffect(() => {
        fetchIngredientes();
    }, []);

    return { ingredientes, fetchIngredientes, setIngredientes, error };
};

export default useGetIngredientes;
