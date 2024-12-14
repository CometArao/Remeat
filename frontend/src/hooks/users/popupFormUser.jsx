import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { changeUserPassword } from '@services/user.service.js';
import { useState, useEffect } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js'; // Asegúrate de importar las funciones
import { getHorariosLaborales } from '@services/horarios.service.js'; // Servicio para obtener horarios laborales
import PopupChangePassword from './popupChangePassword'; // Ajustar la ruta si es necesario

export default function PopupFormUser({ show, setShow, data, action, isEdit }) {
    const userData = data && data.length > 0 ? data[0] : {};
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [horariosLaborales, setHorariosLaborales] = useState([]);

    // Obtener los horarios laborales desde el backend
    useEffect(() => {
        const fetchHorariosLaborales = async () => {
            try {
                const response = await getHorariosLaborales();
                setHorariosLaborales(response); // Almacenar los horarios laborales en el estado
            } catch (error) {
                console.error("Error obteniendo horarios laborales:", error);
                showErrorAlert("Error", "Hubo un problema al obtener los horarios laborales.");
            }
        };

        fetchHorariosLaborales();
    }, []);

    const handleSubmit = (formData) => {
        action(formData);
    };

    const handleChangePassword = async (passwordData) => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showErrorAlert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            await changeUserPassword(userData.id_usuario, passwordData.newPassword);
            showSuccessAlert('¡Éxito!', 'Contraseña cambiada con éxito');
            setShowChangePasswordPopup(false);
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            showErrorAlert('Error', 'Hubo un problema al cambiar la contraseña.');
        }
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar Usuario" : "Crear Usuario"}
                            fields={[
                                {
                                    label: "Nombre",
                                    name: "nombre_usuario",
                                    defaultValue: userData.nombre_usuario || "",
                                    placeholder: "Ej: Juan Pablo",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 1,
                                    maxLength: 50,
                                    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                },
                                {
                                    label: "Apellido",
                                    name: "apellido_usuario",
                                    defaultValue: userData.apellido_usuario || "",
                                    placeholder: "Ej: Salazar",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 1,
                                    maxLength: 50,
                                    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                },
                                {
                                    label: "Correo electrónico",
                                    name: "correo_usuario",
                                    defaultValue: userData.correo_usuario || "",
                                    placeholder: "Ej: example@gmail.com",
                                    fieldType: "input",
                                    type: "email",
                                    required: true,
                                    minLength: 15,
                                    maxLength: 35,
                                },
                                {
                                    label: "Contraseña",
                                    name: "contrasena_usuario",
                                    defaultValue: "",
                                    placeholder: "Introduce una contraseña",
                                    fieldType: "input",
                                    type: "password",
                                    required: !isEdit,
                                    minLength: 8,
                                    maxLength: 26,
                                    pattern: /^[a-zA-Z0-9]+$/,
                                },
                                {
                                    label: "Rol",
                                    name: "rol_usuario",
                                    defaultValue: userData.rol_usuario || "",
                                    placeholder: "Ej: administrador",
                                    fieldType: "select",
                                    options: [
                                        { value: 'administrador', label: 'Administrador' },
                                        { value: 'cocinero', label: 'Cocinero' },
                                        { value: 'mesero', label: 'Mesero' },
                                    ],
                                    required: true,
                                },
                                {
                                    label: "Horario Laboral",
                                    name: "id_horario_laboral",
                                    defaultValue: userData.horario_laboral.id_horario_laboral || "",
                                    placeholder: "Selecciona un horario laboral",
                                    fieldType: "select",
                                    options: horariosLaborales.map((horario) => ({
                                        value: horario.id_horario_laboral,
                                        label: horario.descripcion,
                                    })),
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Usuario"}
                            backgroundColor={'#fff'}
                        >
                            {isEdit && (
                                <button
                                    type="button"
                                    className="change-password-button"
                                    onClick={() => setShowChangePasswordPopup(true)}
                                    style={{
                                        backgroundColor: "#FF6347",
                                        color: "#FFFFFF",
                                        padding: "10px 20px",
                                        marginBottom: "10px",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        display: "block",
                                    }}
                                >
                                    Cambiar Contraseña
                                </button>
                            )}
                        </Form>
                    </div>
                </div>
            )}

            <PopupChangePassword
                show={showChangePasswordPopup}
                setShow={setShowChangePasswordPopup}
                userId={userData.id_usuario}
                onChangePassword={handleChangePassword}
            />
        </div>
    );
}
