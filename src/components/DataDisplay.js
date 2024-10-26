import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { getNameAndUsername } from '../utils/claimUtils';
import BotonAuth from './BotonAuth';
import './css/Data.css';
import logo from './img/logoo.png';

export const IdTokenData = (props) => {
    const { name, preferred_username } = getNameAndUsername(props.idTokenClaims);

    // Estado para la recarga, ganancias y nickname
    const [reload, setReload] = useState(500); // Valor inicial de recarga
    const [earnings, setEarnings] = useState(1500); // Valor inicial de ganancias
    const [nickname, setNickname] = useState("Player123"); // Valor inicial del nickname

    // Manejadores de cambio de valor
    const handleReloadChange = (e) => setReload(e.target.value);
    const handleNicknameChange = (e) => setNickname(e.target.value);

    return (
        <>
            {/* Barra de Navegación */}
            <header className="table-header">
                <div className="header-logo">
                    <img src={logo} alt="Logo" className="logo-header" />
                </div>
                <div className="header-info-right">
                    <BotonAuth />
                </div>
            </header>

            {/* Tarjeta de perfil del usuario */}
            <div className="user-info-container">
                <div className="user-card">
                    <h2>👤 Player Profile</h2>
                    <div className="user-details">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Username:</strong> {preferred_username}</p>
                        
                        {/* Campo de entrada para el Nickname */}
                        <p>
                            <strong>Nickname:</strong>
                            <input
                                type="text"
                                value={nickname}
                                onChange={handleNicknameChange}
                                className="nickname-input"
                            />
                        </p>

                        <p><strong>Saldo:</strong> $1,000</p>
                        
                        {/* Casilla para mostrar y actualizar recarga */}
                        <p>
                            <strong>Recarga:</strong>
                            <input
                                type="number"
                                value={reload}
                                onChange={handleReloadChange}
                                className="reload-input"
                            />
                        </p>

                        {/* Casilla de ganancias */}
                        <p><strong>Ganancias:</strong> ${earnings}</p>
                    </div>
                </div>

                {/* Botón "Jugar" debajo de la tarjeta de perfil */}
                <Button href="/BlackJackRoyale/Game" variant="warning" className="play-button">
                    Jugar
                </Button>
            </div>
        </>
    );
};

export default IdTokenData;
