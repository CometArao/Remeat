import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function Popup({ show, setShow, data, action, isEdit }) {
    // Obtener los datos de la unidad de medida o inicializar un objeto vacío
    const unidadMedidaData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData); // Llama a la acción correspondiente (crear o editar)
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        {/* Botón para cerrar el popup */}
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>

                        {/* Formulario dinámico según si es creación o edición */}
                        <Form
                            title={isEdit ? "Editar Unidad de Medida" : "Crear Unidad de Medida"}
                            fields={[
                                {
                                    label: "Nombre de la Unidad de Medida",
                                    name: "nombre_unidad_medida",
                                    defaultValue: unidadMedidaData.nombre_unidad_medida || "",
                                    placeholder: "Kilogramo",
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
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Unidad de Medida"}
                            backgroundColor="#fff"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
