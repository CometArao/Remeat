import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupFormProveedores({ show, setShow, data, action, isEdit }) {
    const proveedorData = data && data.length > 0 ? data[0] : {};

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
                            title={isEdit ? "Editar Proveedor" : "Crear Proveedor"}
                            fields={[
                                {
                                    label: "Nombre del Proveedor",
                                    name: "nombre_proveedor",
                                    defaultValue: proveedorData.nombre_proveedor || "",
                                    placeholder: "Ej: Distribuidora ABC",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 100,
                                },
                                {
                                    label: "Tipo de Proveedor",
                                    name: "tipo_proveedor",
                                    defaultValue: proveedorData.tipo_proveedor || "",
                                    placeholder: "Ej: Alimentos",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                },
                                {
                                    label: "Correo del Proveedor",
                                    name: "correo_proveedor",
                                    defaultValue: proveedorData.correo_proveedor || "",
                                    placeholder: "Ej: contacto@proveedor.com",
                                    fieldType: "input",
                                    type: "email",
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Proveedor"}
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
