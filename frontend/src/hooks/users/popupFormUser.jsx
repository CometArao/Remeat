import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupFormUser({ show, setShow, data, action }) {
    const userData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
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
                            title="Editar usuario"
                            fields={[
                                {
                                    label: "Nombre",
                                    name: "nombre_usuario",
                                    defaultValue: userData.nombre_usuario || "",
                                    placeholder: "Ej: Diego",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                },
                                {
                                    label: "Apellido",
                                    name: "apellido_usuario",
                                    defaultValue: userData.apellido_usuario || "",
                                    placeholder: "Ej: Salazar",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                },
                                {
                                    label: "Correo electrónico",
                                    name: "correo_usuario",
                                    defaultValue: userData.correo_usuario || "",
                                    placeholder: "Ej: example@correo.com",
                                    fieldType: "input",
                                    type: "email",
                                    required: true,
                                    maxLength: 100,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Guardar Cambios"
                            backgroundColor="#fff"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
