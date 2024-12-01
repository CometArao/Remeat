import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    console.log("user")
    console.log(user)
    const userRole = user?.rol_usuario;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
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
                    <li>
                        <NavLink
                            to="/home"
                            onClick={() => {
                                setMenuOpen(false);
                                addActiveClass();
                            }}
                            activeClassName="active"
                        >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                    <li>
                        <NavLink 
                            to="/users" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Usuarios
                        </NavLink>
                    </li>
                    )}

                    {userRole === 'administrador' && (
                        <li>
                            <NavLink
                                to="/ingredientes"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Ingredientes
                            </NavLink>
                        </li>
                    )}
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink
                                to="/tipo_utensilio"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Utensilios
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink
                            to="/proveedores"
                            onClick={() => {
                                setMenuOpen(false);
                                addActiveClass();
                            }}
                            activeClassName="active"
                        >
                            Proveedores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/informes"
                            onClick={() => {
                                setMenuOpen(false);
                                addActiveClass();
                            }}
                            activeClassName="active"
                        >
                            Informes
                        </NavLink>
                    </li>


                    {userRole === 'administrador' && (
                        <li>
                            <NavLink
                                to="/mermas"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                                Mermas
                            </NavLink>
                        </li>
                    )}
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink
                                to="/ingredientes2"
                                onClick={() => {
                                    setMenuOpen(false);
                                    addActiveClass();
                                }}
                                activeClassName="active"
                            >
                               Ingredientes 
                            </NavLink>
                        </li>
                    )}
                    {/* Nuevas rutas para mesero */}
                    {userRole === 'mesero' && (
                    <li>
                        <NavLink 
                            to="/comandas" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Comandas
                        </NavLink>
                    </li>
                    )}
                    {userRole === 'mesero' && (
                    <li>
                        <NavLink 
                            to="/menu/generate-qr" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Generar QR
                        </NavLink>
                    </li>
                    )}
                    <li>
                        <NavLink
                            to="/auth"
                            onClick={() => {
                                logoutSubmit();
                                setMenuOpen(false);
                            }}
                            activeClassName="active"
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
