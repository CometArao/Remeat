import axios from './root.service.js';
import cookies from 'js-cookie'; // Importa correctamente
import { logout } from './auth.service.js';

const handleErrorResponse = (error) => {
    if (error.response?.status === 403) {
        console.warn('Acceso denegado: fuera de horario laboral.');
        window.location.href = '/fuera-horario'; // Redirige a la página específica
    } else if (error.response?.status === 401) {
        console.warn('Acceso denegado: token expirado.');
        window.location.href = '/auth'; // Redirigir al login
    } else {
        console.error('Error:', error);
    }
    throw error; // Opcional: Lanza el error para manejarlo en otras partes
};

export async function getUsers() {
    try {
        const { data } = await axios.get('/usuarios/');
        return data.data; // Asegúrate de que el backend envíe esta estructura
    } catch (error) {
        handleErrorResponse(error); // Maneja el error aquí
        return [];
    }
}

export async function createUser(data) {
    try {
        const token = cookies.get('jwt-auth'); // Asegúrate de obtener el token actual
        const response = await axios.post('/usuarios/', data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error en createUser:', error);
        throw error; // Manejo de errores desde el frontend
    }
}

export async function updateUser(data, id_usuario) {
    try {
        const token = cookies.get('jwt-auth'); // Obtener el token actual
        const response = await axios.patch(`/usuarios/${id_usuario}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Verificar si el cambio afecta al usuario actual
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
        if (
            id_usuario === usuarioActual.id_usuario &&
            (data.correo_usuario !== usuarioActual.correo_usuario ||
             data.rol_usuario !== usuarioActual.rol_usuario)
        ) {
            await logout(); // Cierra la sesión
            window.location.href = '/login'; // Redirige al inicio de sesión
        }

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            await logout();
            window.location.href = '/login';
        }
        throw error;
    }
}

export async function changeUserPassword(id_usuario, newPassword) {
    try {
        const response = await axios.patch(`/usuarios/${id_usuario}/contrasena`, { newPassword });
        return response.data;
    } catch (error) {
        console.error('Error en changeUserPassword:', error);
        throw error;
    }
}

export async function deleteUser(id_usuario) {
    try {
        const response = await axios.delete(`/usuarios/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteUser:', error);
        throw error; // Manejo de errores desde el frontend
    }
}