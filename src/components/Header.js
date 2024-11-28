import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo1.PNG';
import './css/Header.css';
import { useUser } from './UserContext';
import { useMsal } from '@azure/msal-react';

const Header = ({ activeButton, onNavigate }) => {
    const navigate = useNavigate();
    const { userId } = useUser(); // Obtener userId del contexto
    const { instance } = useMsal(); // Instancia de MSAL

    const handleNavigation = (route) => {
        if (!userId) {
            console.error('No se encontró userId. Redirección cancelada.');
            return;
        }

        if (onNavigate) {
            onNavigate(route); // Callback opcional para actualizar estado externo si se necesita
        }

        navigate(`/BlackJackRoyale/${route}`); // Redirigir al destino
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };

    return (
        <header className="Options">
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-header" />
            </div>
            <nav className="menu">
                {['Rules', 'SelectTable', 'History'].map((item) => (
                    <button
                        key={item}
                        className={`btn menu-button ${activeButton === item ? 'active' : ''}`}
                        onClick={() => handleNavigation(item)}
                    >
                        {item}
                    </button>
                ))}
                {/* Botón Sign out */}
                <button
                    className={`btn menu-button ${activeButton === 'SignOut' ? 'active' : ''}`}
                    onClick={handleLogoutRedirect}
                >
                    Sign out
                </button>
            </nav>
        </header>
    );
};

export default Header;
