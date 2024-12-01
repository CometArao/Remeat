import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const unidadMedidaData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
    };
    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title="Editar Unidad de Medida"
                        fields={[
                            {
                                label: "Nombre de la Unidad de Medida",
                                name: "nombre_unidad_medida",
                                defaultValue: unidadMedidaData.nombre_unidad_medida || "",
                                placeholder: 'Kilogramo',   
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 50,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar Tipo Utensilio"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}