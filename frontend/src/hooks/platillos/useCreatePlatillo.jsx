import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de importar el contexto de autenticación
import { createPlatillo } from '@services/platillos.service'; // Asegúrate de que este servicio exista
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreatePlatillo = (fetchPlatillo) => {
    const { user } = useAuth(); // Obtener datos del usuario autenticado
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [dataPlatillo, setDataPlatillo] = useState([]); // Para almacenar datos temporales del formulario

    // Abre el popup de creación
    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    // Lógica para crear un nuevo platillo
    const handleCreate = async (newDataPlatillo) => {
        if (newDataPlatillo) {
            try {
                const token = localStorage.getItem("token"); // Extraer el token del usuario autenticado

                const createdPlatillo = await createPlatillo(newDataPlatillo, token); // Llamada al servicio de creación de platillo
                showSuccessAlert('¡Creado!', 'El platillo ha sido creado correctamente.');
                console.log ('Platillo creado:', createdPlatillo); // Debug
                setIsCreatePopupOpen(false);

                // Llama al fetch para actualizar la lista de platillos desde el servidor
                await fetchPlatillo();

                setDataPlatillo([]); // Limpia los datos temporales
            } catch (error) {
                console.error('Error al crear el platillo:', error);
                showErrorAlert('Error', 'Ocurrió un error al crear el platillo.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen,
        dataPlatillo,
        setDataPlatillo,
    };
};

export default useCreatePlatillo;
