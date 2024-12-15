import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupTipoIngrediente({ show, setShow, data, action, unidadesMedida = [], isEdit }) {
    // Obtener los datos del tipo de ingrediente o inicializar un objeto vacío
    const tipoIngredienteData = data && data.length > 0 ? data[0] : {};

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
                            title={isEdit ? "Editar Tipo Ingrediente" : "Crear Tipo Ingrediente"}
                            fields={[
                                {
                                    label: "Nombre Tipo Ingrediente",
                                    name: "nombre_tipo_ingrediente",
                                    defaultValue: tipoIngredienteData.nombre_tipo_ingrediente || "",
                                    placeholder: "Harina, Azúcar...",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Cantidad Alerta",
                                    name: "cantidad_alerta_tipo_ingrediente",
                                    defaultValue: tipoIngredienteData.cantidad_alerta_tipo_ingrediente || "",
                                    placeholder: "10, 50...",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 1,
                                },
                                {
                                    label: "Unidad de Medida",
                                    name: "id_unidad_medida",
                                    defaultValue: tipoIngredienteData.id_unidad_medida || "",
                                    fieldType: "select",
                                    options: unidadesMedida.map((unidad) => ({
                                        value: unidad.id_unidad_medida,
                                        label: unidad.nombre_unidad_medida,
                                    })),
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Tipo Ingrediente"}
                            backgroundColor="#fff"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
