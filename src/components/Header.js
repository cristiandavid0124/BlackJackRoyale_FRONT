import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo1.PNG';
import './css/Header.css';
import { useUser } from './UserContext';
const Header = ({ activeButton, onNavigate }) => {
    const navigate = useNavigate();
    const { userId } = useUser(); // Obtener userId del contexto

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

    return (
        <header className="Options">
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-header" />
            </div>
            <nav className="menu">
                {['Rules', 'SelectTable', 'History', 'Profile'].map((item) => (
                    <button
                        key={item}
                        className={`btn menu-button ${activeButton === item ? 'active' : ''}`}
                        onClick={() => handleNavigation(item)}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;
