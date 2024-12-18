import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState, useEffect } from "react";
import tablewareIcon from '../assets/icons8-tableware-50.png';
import splitMoneyIcon from '../assets/icons8-split-money-50.png';
import clockIcon from '../assets/icons8-clock-50.png';
import poultryLegIcon from '../assets/icons8-poultry-leg-50.png';
import readingIcon from '../assets/icons8-reading-50.png';
import comunityIcon from '../assets/icons8-community-50.png';
import SaladIcon from '../assets/icons8-salad-bowl-50.png';
import papyrusIcon from '../assets/icons8-papyrus-32.png';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || ''; // Obtener el usuario de sessionStorage
    const userRole = user?.rol_usuario; // Rol del usuario
    const [menuOpen, setMenuOpen] = useState(false); // Sidebar inicia cerrado por defecto

    useEffect(() => {
        setMenuOpen(false); // Asegura que siempre inicia cerrado al recargar la página
    }, [location]);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {/* Sidebar */}
            <nav className={`sidebar ${menuOpen ? "" : "hidden"}`}>
                <div className="nav-menu">
                    <ul>
                        <li><NavLink to="/inicio">Inicio</NavLink></li>
                        <li><NavLink to="/menus"><img style={{width: "40px"}}src={readingIcon} alt="Description of Image" /> Menús</NavLink></li>

                        {/* Rutas para administrador y cocinero */}
                        {(userRole === 'administrador' || userRole === 'cocinero') && (
                            <>
                            <li><NavLink to="/platillos"><img style={{width: "40px"}}src={SaladIcon} alt="Description of Image" />Platillos</NavLink></li>
                            <li><NavLink to="/ingredientes">Ingredientes</NavLink></li>
                            <li><NavLink to="/tipo_utensilios"><img style={{width: "40px"}}src={tablewareIcon} alt="Description of Image" />    <span></span>Tipos de Utensilios </NavLink></li>
                            <li><NavLink to="/utensilios">Utensilios</NavLink></li>
                            <li><NavLink to="/tipos_ingredientes"><img style={{width: "40px"}}src={poultryLegIcon} alt="Description of Image" />Tipos de Ingredientes</NavLink></li>
                            <li><NavLink to="/unidades_medidas">Unidades de medida</NavLink></li>
                            </>
                        )}

                        {/* Rutas para mesero */}
                        {userRole === 'mesero' && (
                            <>
                                <li><NavLink to="/comandas">Comandas</NavLink></li>
                                <li><NavLink to="/menu/generate-qr">Generar QR</NavLink></li>
                            </>
                        )}

                        {/* Rutas solo para administrador */}
                        {userRole === 'administrador' && (
                            <>
                                <li><NavLink to="/usuarios"><img style={{width: "40px"}}src={comunityIcon} alt="Description of Image" />Usuarios</NavLink></li>
                                <li><NavLink to="/informes"><img style={{width: "40px"}}src={papyrusIcon} alt="Description of Image" />Informes</NavLink></li>
                                <li><NavLink to="/mermas"><img style={{width: "40px"}}src={splitMoneyIcon} alt="Description of Image" /> Mermas</NavLink></li>
                                <li><NavLink to="/pedidos">Pedidos</NavLink></li>
                                <li><NavLink to="/proveedores">Proveedores</NavLink></li>
                                <li><NavLink to="/horarios_laborales"><img style={{width: "40px"}}src={clockIcon} alt="Description of Image" />Horarios laborales</NavLink></li>
                            </>
                        )}

                        {/* Rutas solo para cocinero */}
                        {userRole === 'cocinero' && (
                            <>
                                <li><NavLink to="/platillos/confirma-platillo">Confirmar Platillo</NavLink></li>
                            </>
                        )}

                        <li><NavLink to="/auth" onClick={logoutSubmit}>Cerrar sesión</NavLink></li>
                    </ul>
                </div>
                {/* Botón para cerrar sidebar */}
                <button className="sidebar-toggle" onClick={toggleMenu}>
                    {menuOpen ? "Ocultar ←" : "Mostrar →"}
                </button>
            </nav>

            {/* Botón flotante para mostrar el sidebar */}
            {!menuOpen && (
                <button className="sidebar-float-btn" onClick={toggleMenu}>
                    &#9776;
                </button>
            )}
        </>
    );
};

export default Sidebar;
