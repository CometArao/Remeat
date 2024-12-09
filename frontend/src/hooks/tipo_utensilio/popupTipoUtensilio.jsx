import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupTipoUtensilio({ show, setShow, data, action, isEdit }) {
    const tipoUtensilioData = data && data.length > 0 ? data[0] : {};

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
                            title={isEdit ? "Editar Tipo Utensilio" : "Crear Tipo Utensilio"}
                            fields={[
                                {
                                    label: "Nombre Tipo Utensilio",
                                    name: "nombre_tipo_utensilio",
                                    defaultValue: tipoUtensilioData.nombre_tipo_utensilio || "",
                                    placeholder: "Cuchara, Tenedor...",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                    patternMessage: "Debe contener solo letras y espacios",
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear"}
                            backgroundColor="#fff"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
