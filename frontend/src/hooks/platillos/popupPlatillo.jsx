import Form from '@components/Form';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupPlatillo({ show, setShow, data, action, tiposIngrediente = [], usuario = [], isEdit }) {
    const platilloData = data && data.length > 0 ? data[0] : {};

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
                             title={isEdit ? "Editar Platillo" : "Crear Platillo"}
                             fields={[
                                 {
                                     label: "Nombre del Platillo",
                                     name: "nombre_platillo",
                                     defaultValue: platilloData.nombre_platillo || "",
                                     placeholder: "Ej: Pizza",
                                     fieldType: "input",
                                     type: "text",
                                     required: true,
                                 },
                                 {
                                     label: "Disponibilidad",
                                     name: "disponible",
                                     defaultValue: platilloData.disponible || "",
                                     placeholder: "Ej: true",
                                     fieldType: "input",
                                     type: "boolean",
                                     required: true,
                                 },
                                 {
                                    label: "Encargado",
                                    name: "id_usuario",
                                    defaultValue: platilloData.id_usuario || "",
                                    fieldType: "select",
                                    options: usuario.map((user) => ({
                                        value: user.id_usuario,
                                        label: user.nombre_usuario,
                                    })),
                                    required: true,
                                },
                                 
                                 {
                                     label: "Tipo de Ingrediente",
                                     name: "id_tipo_ingrediente",
                                     defaultValue: platilloData.id_tipo_ingrediente || "",
                                     fieldType: "select",
                                     options: tiposIngrediente.map((tipo) => ({
                                         value: tipo.id_tipo_ingrediente,
                                         label: tipo.nombre_tipo_ingrediente,
                                     })),
                                     required: true,
                                 },
                             ]}
                             onSubmit={handleSubmit}
                             buttonText={isEdit ? "Guardar Cambios" : "Crear Platillo"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
