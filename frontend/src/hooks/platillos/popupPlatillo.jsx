import Form from '@components/FormPlatillo';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupPlatillo({
  show,
  setShow,
  data,
  action,
  usuario = [],
  isEdit
}) {
  const platilloData = data && data.length > 0 ? data[0] : {};

  const fields = [
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
      label: "Disponible",
      name: "disponible",
      defaultValue: platilloData.disponible !== undefined ? platilloData.disponible : true,
      fieldType: "input",
      type: "checkbox",
      required: false,
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
      label: "Ingredientes",
      name: "ingredientes",
      // Sin defaultValue si es nuevo, si es editar, puedes mapearlo a [{ value: x, label: y }, ...]
      defaultValue: isEdit && platilloData.ingredientes ? platilloData.ingredientes.map(ing => ({
        value: ing.id_tipo_ingrediente,
        label: ing.nombre_tipo_ingrediente
      })) : [],
      fieldType: "ingredientes",
      required: true,
    },
  ];
  const handleSubmit = (formData) => {
    const ingredientes = formData.ingredientes.map((ing) => ({
        id_tipo_ingrediente: ing.value,
        porcion_ingrediente_platillo: ing.porcion || 1, // Porción predeterminada si no se especifica
    }));
    const payload = {
        nombre_platillo: formData.nombre_platillo,
        disponible: formData.disponible,
        id_usuario: formData.id_usuario,
        ingredientes,
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
              title={isEdit ? "Editar Platillo" : "Crear Platillo"}
              fields={fields}
              onSubmit={handleSubmit}
              buttonText={isEdit ? "Guardar Cambios" : "Crear Platillo"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
