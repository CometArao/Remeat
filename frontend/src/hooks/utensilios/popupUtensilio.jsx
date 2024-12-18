import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupUtensilio({ show, setShow, data, action, tiposUtensilio = [], isEdit }) {
    const utensilioData = data && data.length > 0 ? data[0] : {};

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
                            title={isEdit ? "Editar Utensilio" : "Crear Utensilio"}
                            fields={[
                                {
                                    label: "Cantidad",
                                    name: "cantidad_utensilio",
                                    defaultValue: utensilioData.cantidad_utensilio || "",
                                    placeholder: "Ej: 10",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 1,
                                },
                                {
                                    label: "Costo",
                                    name: "costo_utensilio",
                                    defaultValue: utensilioData.costo_utensilio || "",
                                    placeholder: "Ej: 1000",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 1,
                                },
                                {
                                    label: "Tipo de Utensilio",
                                    name: "id_tipo_utensilio",
                                    defaultValue: utensilioData.id_tipo_utensilio || "",
                                    fieldType: "select",
                                    options: tiposUtensilio.map((tipo) => ({
                                        value: tipo.id_tipo_utensilio,
                                        label: tipo.nombre_tipo_utensilio,
                                    })),
                                    required: true,
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
