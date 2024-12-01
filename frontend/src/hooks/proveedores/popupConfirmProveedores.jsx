import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupConfirmProveedores({ show, setShow, onConfirm, title, message }) {
    const handleConfirm = () => {
        onConfirm();
        setShow(false); // Cerrar el popup después de confirmar
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <h2>{title || "Confirmar Acción"}</h2>
                        <p>{message || "¿Estás seguro de realizar esta acción?"}</p>
                        <div className="popup-actions">
                            <button className="confirm-button" onClick={handleConfirm}>
                                Confirmar
                            </button>
                            <button className="cancel-button" onClick={() => setShow(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
