import { useState, useEffect } from 'react';
import { getUsers } from '@services/user.service.js';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            const formattedData = response.map(user => ({
                id_usuario: user.id_usuario, // Asegúrate de incluir id_usuario
                nombre_usuario: user.nombre_usuario,
                apellido_usuario: user.apellido_usuario,
                correo_usuario: user.correo_usuario,
                rol_usuario: user.rol_usuario,
            }));
            setUsers(formattedData);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, fetchUsers, setUsers };
};

export default useUsers;
