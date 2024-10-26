import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getNameAndUsername } from '../utils/claimUtils';
import BotonAuth from './BotonAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Para hacer peticiones HTTP
import './css/Data.css';
import logo from './img/logoo.png';

export const IdTokenData = (props) => {
    const { name, preferred_username } = getNameAndUsername(props.idTokenClaims);
    const navigate = useNavigate();

    const [reload, setReload] = useState(500); 
    const [earnings, setEarnings] = useState(1500); 
    const [nickname, setNickname] = useState("Player123"); 

    // Verificar si el usuario existe y crearlo si no
    useEffect(() => {
        const checkOrCreateUser = async () => {
            try {
                console.log(`Enviando petición GET a http://localhost:8080/users/${preferred_username}`);
                const response = await axios.get(`http://localhost:8080/users/${preferred_username}`);
                console.log('Respuesta de GET:', response);
        
                if (response.status === 200) {
                    console.log('Usuario encontrado:', response.data);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('Usuario no encontrado, creando nuevo usuario...');
                    try {
                        console.log('Enviando petición POST a http://localhost:8080/users');
                        const postResponse = await axios.post('http://localhost:8080/users', {
                            id: preferred_username,
                            email: preferred_username,
                            name: name,
                            nickname: "Player123", // Valor inicial del nickname
                            reload: 500,           // Valor inicial del saldo
                            earnings: 1500         // Valor inicial de las ganancias
                        });
                        console.log('Respuesta de POST:', postResponse.data);
                    } catch (postError) {
                        console.error('Error al crear el usuario:', postError);
                    }
                } else {
                    console.error("Error verificando el usuario:", error);
                }
            }
        };
        

        checkOrCreateUser();
    }, [preferred_username, name]);

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

                {/* Botón "Jugar" redirige a /BlackJackRoyale/SelectTable */}
                <Button onClick={() => navigate('/BlackJackRoyale/SelectTable')} variant="warning" className="play-button">
                    Jugar
                </Button>
            </div>
        </>
    );
};

export default IdTokenData;
