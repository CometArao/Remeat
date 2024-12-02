import { useState } from 'react';
import { createUser } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useCreateUser = (setUsers) => {
    const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);

    const handleClickCreate = () => {
        setIsCreatePopUpOpen(true);
    };

    const handleCreate = async (newUserData) => {
        if (newUserData) {
            try {
                const createdUser = await createUser(newUserData);
                showSuccessAlert('¡Usuario Creado!', 'El usuario se ha registrado correctamente.');
                setUsers((prev) => [...prev, createdUser.data]);
                setIsCreatePopUpOpen(false);
            } catch (error) {
                console.error('Error al crear el usuario:', error);
                showErrorAlert('Error', 'Ocurrió un problema al crear el usuario.');
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
