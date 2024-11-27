import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function Popup({ show, setShow, data, action , title, onSubmitText }) {
    const mermaData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
    };
    /*
    El pop up deberia tener una lista de todos los utensilios
    y elegir el cual se ve mermado y en que cantidad. 


    Al crear una merma se abre una pagina con una tabla
    que contenga todos los tipos de utensilio y tipo de ingrediente
    */
    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title= { title }
                        fields={[
                            {
                                label: "Nombre Utensilio",
                                name: "nombre_tipo_utensilio",
                                defaultValue: mermaData.fecha || "",
                                placeholder: 'Cuchara',
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
                        buttonText= { onSubmitText }
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}