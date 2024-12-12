import Form from '@components/FormPlatillo'; // Asegúrate de tener un componente de formulario reutilizable
import CloseIcon from '@assets/XIcon.svg';

export default function PopupPrecio({ show, setShow, data, action }) {
  const platilloData = data || {}; // Obtiene los datos del platillo

  // Definición de los campos del formulario
  const fields = [
    {
      label: "Precio",
      name: "precio_platillo",
      defaultValue: platilloData.precio_platillo || "", // Valor por defecto
      placeholder: "Ej: 100",
      fieldType: "input",
      type: "number", // Tipo numérico para el precio
      required: true,
    },
  ];

  const handleSubmit = (formData) => {
    // Llama a la acción con el nuevo precio
    action(formData.precio_platillo);
  };

  return (
    <div>
      {show && (
        <div className="bg">
          <div className="popup">
            <button className="close" onClick={() => setShow(false)}>
              <img src={CloseIcon} alt="Cerrar" />
            </button>
            <h2>Editar Precio</h2>
            <Form
              title="Editar Precio del Platillo"
              fields={fields}
              onSubmit={handleSubmit}
              buttonText="Guardar Cambios"
            />
          </div>
        </div>
      )}
    </div>
  );
}
