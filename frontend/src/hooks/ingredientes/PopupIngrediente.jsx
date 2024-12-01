import Form from '@components/Form';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupIngrediente({ show, setShow, data, action, tiposIngrediente = [], isEdit }) {
    const ingredienteData = data && data.length > 0 ? data[0] : {};

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
                             title={isEdit ? "Editar Ingrediente" : "Crear Ingrediente"}
                             fields={[
                                 {
                                     label: "Fecha de vencimiento",
                                     name: "fecha_vencimiento",
                                     defaultValue: ingredienteData.fecha_vencimiento || "",
                                     placeholder: "Ej: 2029-12-31",
                                     fieldType: "input",
                                     type: "date",
                                     required: true,
                                 },
                                 {
                                     label: "Cantidad Actual",
                                     name: "cantidad_ingrediente",
                                     defaultValue: ingredienteData.cantidad_ingrediente || "",
                                     placeholder: "Ej: 5",
                                     fieldType: "input",
                                     type: "number",
                                     required: true,
                                     min: 1,
                                 },
                                 {
                                     label: "Cantidad Original",
                                     name: "cantidad_original_ingrediente",
                                     defaultValue: ingredienteData.cantidad_original_ingrediente || "",
                                     placeholder: "Ej: 10",
                                     fieldType: "input",
                                     type: "number",
                                     required: true,
                                     min: 1,
                                 },
                                 {
                                     label: "Costo",
                                     name: "costo_ingrediente",
                                     defaultValue: ingredienteData.costo_ingrediente || "",
                                     placeholder: "Ej: 5.50",
                                     fieldType: "input",
                                     type: "number",
                                     required: true,
                                 },
                                 {
                                     label: "Tipo de Ingrediente",
                                     name: "id_tipo_ingrediente",
                                     defaultValue: ingredienteData.id_tipo_ingrediente || "",
                                     fieldType: "select",
                                     options: tiposIngrediente.map((tipo) => ({
                                         value: tipo.id_tipo_ingrediente,
                                         label: tipo.nombre_tipo_ingrediente,
                                     })),
                                     required: true,
                                 },
                                 {
                                     label: "ID Pedido (Opcional)",
                                     name: "id_pedido",
                                     defaultValue: ingredienteData.id_pedido || "",
                                     placeholder: "Ej: 3",
                                     fieldType: "input",
                                     type: "number",
                                     required: false,
                                 },
                             ]}
                             onSubmit={handleSubmit}
                             buttonText={isEdit ? "Guardar Cambios" : "Crear Ingrediente"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
