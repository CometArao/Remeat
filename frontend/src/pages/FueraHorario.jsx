    import {
        useNavigate,
    } from "react-router-dom";
    import '@styles/fuerahorario.css';

    const FueraHorario = () => {
        const navigate = useNavigate();

        return (
            <main className="error_404">
                <div className="card">
                    <h1>Fuera de Horario</h1>
                    <h3>~ Acceso Restringido :( ~</h3>
                    <h4>
                        Lo sentimos, estás intentando acceder fuera de tu horario laboral permitido.
                        Por favor, vuelve en otro momento.
                    </h4>
                    <button onClick={() => navigate('/inicio')}>
                        Volver al Inicio
                    </button>
                </div>
            </main>
        );
    };

    export default FueraHorario;
