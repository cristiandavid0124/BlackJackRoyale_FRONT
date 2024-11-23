import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './img/logo1.PNG';
import './css/Header.css';

const Header = ({ activeButton, onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id, name } = location.state || {};


    const handleNavigation = (route) => {
        onNavigate(route);

        // Enviar siempre id y name en el state al navegar
        navigate(`/BlackJackRoyale/${route}`, {
            state: { userId: id },
        });
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

