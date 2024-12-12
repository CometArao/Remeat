import Form from '@components/FormMenu';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupMenu({
    show,
    setShow,
    data,
    action,
    usuario = [],
    platillos = [],
    isEdit
}) {
    const menuData = data && data.length > 0 ? data[0] : {};

    const fields = [
        {
            label: "Fecha",
            name: "fecha",
            defaultValue: menuData.fecha || "",
            placeholder: "Ej: 2025-12-31",
            fieldType: "input",
            type: "date",
            required: true,
        },
        {
            label: "Disponibilidad",
            name: "disponibilidad",
            defaultValue: menuData.disponibilidad !== undefined ? menuData.disponibilidad : true,
            fieldType: "input",
            type: "checkbox",
            required: false,
        },
        {
            label: "Creador",
            name: "id_usuario",
            defaultValue: menuData.usuario?.id_usuario || "",
            fieldType: "select",
            options: usuario.map((user) => ({
                value: user.id_usuario,
                label: user.nombre_usuario,
            })),
            required: true,
        },
        {
            label: "Platillos",
            name: "platillos",
            defaultValue: isEdit && menuData.platillos ? menuData.platillos.map(plat => ({
                value: plat.id_platillo,
                label: plat.nombre_platillo
            })) : [],
            fieldType: "platillos",
            options: platillos.map((plat) => ({
                value: plat.id_platillo,
                label: plat.nombre_platillo,
            })), // Pasar opciones válidas
            required: true,
        },
    ];

    const handleSubmit = (formData) => {
        const platillos = Array.isArray(formData.platillos)
            ? formData.platillos.map((plat) => ({
                id_platillo: plat.value,
            }))
            : []; // Si no es un arreglo, se retorna vacío.

        console.log('Platillos seleccionados en PopupMenu:', platillos);

        const payload = {
            fecha: formData.fecha,
            disponibilidad: formData.disponibilidad,
            platillos,
        };

        action(payload);
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
                            title={isEdit ? 'Editar Menú' : 'Crear Menú'}
                            fields={fields}
                            onSubmit={handleSubmit}
                            buttonText={isEdit ? 'Guardar Cambios' : 'Crear Menú'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
