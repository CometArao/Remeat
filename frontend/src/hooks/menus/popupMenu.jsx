import Form from '@components/FormMenu';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupMenu({
    show,
    setShow,
    data,
    action,
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
            })),
            required: true,
        },
    ];

    const handleSubmit = (formData) => {
        const platillosSeleccionados = Array.isArray(formData.platillos)
            ? formData.platillos.map((plat) => ({
                id_platillo: plat.value,
            }))
            : [];
    
        const payload = {
            fecha: formData.fecha,
            platillos: platillosSeleccionados,
        };
    
        console.log("Payload enviado:", payload);
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
