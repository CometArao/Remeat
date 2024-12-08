import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupChangePassword({ show, setShow, userId, onChangePassword }) {
    const handleSubmit = (formData) => {
        onChangePassword(formData);
    };

    return (
        <>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title="Cambiar Contraseña"
                            fields={[
                                {
                                    label: "Nueva Contraseña",
                                    name: "newPassword",
                                    defaultValue: "",
                                    placeholder: "Introduce la nueva contraseña",
                                    fieldType: "input",
                                    type: "password",
                                    required: true,
                                    minLength: 6,
                                    maxLength: 50,
                                },
                                {
                                    label: "Confirmar Contraseña",
                                    name: "confirmPassword",
                                    defaultValue: "",
                                    placeholder: "Confirma la nueva contraseña",
                                    fieldType: "input",
                                    type: "password",
                                    required: true,
                                    minLength: 6,
                                    maxLength: 50,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Cambiar Contraseña"
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
