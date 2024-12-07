import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || ''; // Obtener el usuario de sessionStorage
    const userRole = user?.rol_usuario; // Rol del usuario
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout(); // Llamar al servicio de logout
            navigate('/auth'); // Redirigir a la página de autenticación
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    {/* Ruta de inicio */}
                    <li>
                        <NavLink
                            to="/inicio"
                            onClick={() => {
                                setMenuOpen(false);
                                addActiveClass();
                            }}
                        >
                            Inicio
                        </NavLink>
                    </li>

                    {/* Rutas para administrador y cocinero */}
                    {(userRole === 'administrador' || userRole === 'cocinero') && (
                        <>
                            <li>
                                <NavLink
                                    to="/ingredientes"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Ingredientes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/tipo_utensilio"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Utensilios
                                </NavLink>
                            </li>  
                            <li>
                                <NavLink
                                    to="/tipos_ingredientes"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Tipos de Ingredientes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/unidades_medidas"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Unidades de medida
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Rutas para mesero */}
                    {userRole === 'mesero' && (
                        <>
                            <li>
                                <NavLink
                                    to="/comandas"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Comandas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/menu/generate-qr"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Generar QR
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Rutas solo para adminitrador */}
                    {userRole === 'administrador' && (
                        <>
                            <li>
                            <NavLink
                                    to="/usuarios"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/informes"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Informes
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/mermas"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Mermas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pedidos"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Pedidos
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/proveedores"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        addActiveClass();
                                    }}
                                >
                                    Proveedores
                                </NavLink>
                            </li>
                        </>
                    )}


                    {/* Cerrar sesión */}
                    <li>
                        <NavLink
                            to="/auth"
                            onClick={() => {
                                logoutSubmit();
                                setMenuOpen(false);
                            }}
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Botón hamburguesa para menú colapsable */}
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
