import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupPedido({ show, setShow, data, action, isEdit, users, proveedores, ingredientes }) {
    const pedidoData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
    };

    // Verificar los ingredientes
    console.log('Ingredientes en PopupPedido:', ingredientes);

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title={isEdit ? "Editar Pedido" : "Crear Pedido"}
                            fields={[
                                {
                                    label: "Descripción del Pedido",
                                    name: "descripcion_pedido",
                                    defaultValue: pedidoData.descripcion_pedido || "",
                                    placeholder: "Ej: Pedido para evento especial",
                                    fieldType: "input",
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 255,
                                },
                                {
                                    label: "Fecha de Compra",
                                    name: "fecha_compra_pedido",
                                    defaultValue: pedidoData.fecha_compra_pedido || "",
                                    placeholder: "Ej: 2024-12-01",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                {
                                    label: "Fecha de Entrega",
                                    name: "fecha_entrega_pedido",
                                    defaultValue: pedidoData.fecha_entrega_pedido || "",
                                    placeholder: "Ej: 2024-12-10",
                                    fieldType: "input",
                                    type: "date",
                                    required: true,
                                },
                                {
                                    label: "Costo del Pedido",
                                    name: "costo_pedido",
                                    defaultValue: pedidoData.costo_pedido || "",
                                    placeholder: "Ej: 2500",
                                    fieldType: "input",
                                    type: "number",
                                    required: true,
                                    min: 0,
                                },
                                {
                                    label: "Usuario",
                                    name: "id_usuario",
                                    defaultValue: pedidoData.id_usuario || "",
                                    fieldType: "select",
                                    options: users.map((user) => ({
                                        value: user.id_usuario,
                                        label: `${user.nombre_usuario} ${user.apellido_usuario}`,
                                    })),
                                    required: true,
                                },
                                {
                                    label: "Proveedor",
                                    name: "id_proveedor",
                                    defaultValue: pedidoData.id_proveedor || "",
                                    fieldType: "select",
                                    options: proveedores.map((proveedor) => ({
                                        value: proveedor.id_proveedor,
                                        label: proveedor.nombre_proveedor,
                                    })),
                                    required: true,
                                },
                                {
                                    label: "Ingredientes",
                                    name: "ingredientes",
                                    defaultValue: pedidoData.ingredientes?.map((ing) => ing.id_ingrediente) || [],
                                    fieldType: "select",
                                    multiple: true, // Habilitamos la selección múltiple
                                    options: ingredientes.map((ingrediente) => ({
                                        value: ingrediente.id_ingrediente,
                                        label: ingrediente.tipo_ingrediente && ingrediente.tipo_ingrediente.nombre_tipo_ingrediente
                                            ? `${ingrediente.tipo_ingrediente.nombre_tipo_ingrediente} (ID: ${ingrediente.id_ingrediente})`
                                            : `Ingrediente ${ingrediente.id_ingrediente}`,
                                    })),
                                    required: false,
                                },
                                /*
                                {
                                    label: "Utensilios",
                                    name: "utensilios",
                                    defaultValue: pedidoData.utensilios?.map((ut) => ut.id_utensilio) || [],
                                    fieldType: "select",
                                    multiple: true,
                                    options: utensilios.map((utensilio) => ({
                                        value: utensilio.id_utensilio,
                                        label: `${utensilio.tipo_utensilio.nombre_tipo_utensilio} (ID: ${utensilio.id_utensilio})`,
                                    })),
                                    required: false,
                                },
                                */
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? "Guardar Cambios" : "Crear Pedido"}
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}