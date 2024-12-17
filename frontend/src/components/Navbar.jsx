import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState, useEffect } from "react";

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
                        <li><NavLink to="/menus">Menús</NavLink></li>

                        {/* Rutas para administrador y cocinero */}
                        {(userRole === 'administrador' || userRole === 'cocinero') && (
                            <>
                                <li><NavLink to="/platillos">Platillos</NavLink></li>
                                <li><NavLink to="/ingredientes">Ingredientes</NavLink></li>
                                <li><NavLink to="/tipo_utensilios">Tipos de Utensilios</NavLink></li>
                                <li><NavLink to="/utensilios">Utensilios</NavLink></li>
                                <li><NavLink to="/tipos_ingredientes">Tipos de Ingredientes</NavLink></li>
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
                                <li><NavLink to="/usuarios">Usuarios</NavLink></li>
                                <li><NavLink to="/informes">Informes</NavLink></li>
                                <li><NavLink to="/mermas">Mermas</NavLink></li>
                                <li><NavLink to="/pedidos">Pedidos</NavLink></li>
                                <li><NavLink to="/proveedores">Proveedores</NavLink></li>
                                <li><NavLink to="/horarios_laborales">Horarios laborales</NavLink></li>
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
