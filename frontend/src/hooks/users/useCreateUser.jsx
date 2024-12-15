import { useState } from 'react';
import { createUser } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateUser = (setUsers, fetchUsers) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);

    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true);
    };

    const handleCreate = async (newUserData) => {
        if (newUserData) {
            try {
                // Convierte id_horario_laboral a entero antes de enviarlo
                const formattedData = {
                    ...newUserData,
                    id_horario_laboral: parseInt(newUserData.id_horario_laboral, 10), // Convertir a entero
                };


                const createdUser = await createUser(formattedData);
                showSuccessAlert('¡Usuario Creado!', 'El usuario se ha registrado correctamente.');
                setUsers((prev) => [...prev, createdUser.data]);

                // Actualizar usuarios en la base de datos
                await fetchUsers();
                setIsCreatePopUpOpen(false);
            } catch (error) {
                console.error('Error al crear el usuario:', error);
                const errorMessage = error.response?.data?.message || 'Ocurrió un problema al crear el usuario.';
                showErrorAlert('Error', errorMessage);
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopUpOpen,
        setIsCreatePopUpOpen,
    };
};

export default useCreateUser;