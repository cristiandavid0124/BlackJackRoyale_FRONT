import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { getNameAndUsername } from '../utils/claimUtils';
import BotonAuth from './BotonAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Data.css';
import logo from './img/logoo.png';

export const IdTokenData = (props) => {
    const { name, preferred_username } = getNameAndUsername(props.idTokenClaims);
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("Player123"); 
    const [nicknameSaved, setNicknameSaved] = useState(false); // Estado para verificar si el nickname está guardado
    const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error si el nickname no está guardado
    const [nicknameError, setNicknameError] = useState(""); // Mensaje de error si el nickname no es válido

    // Verificar si el usuario existe y crearlo si no
    useEffect(() => {
        const checkOrCreateUser = async () => {
            try {
                console.log(`Enviando petición GET a http://localhost:8080/users/${preferred_username}`);
                const response = await axios.get(`http://localhost:8080/users/${preferred_username}`);
                console.log('Respuesta de GET:', response);
        
                if (response.status === 200) {
                    console.log('Usuario encontrado:', response.data);
                    setNickname(response.data.nickName || ""); // Establecer el nickname existente o vacío si no está
                    setNicknameSaved(!!response.data.nickName); // Marcar como guardado si el nickname existe
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('Usuario no encontrado, creando nuevo usuario...');
                    try {
                        console.log('Enviando petición POST a http://localhost:8080/users');
                        const postResponse = await axios.post('http://localhost:8080/users', {
                            email: preferred_username,
                            name: name
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        console.log('Respuesta de POST:', postResponse.data);
                        setNicknameSaved(false); // El nickname no está guardado inicialmente
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
    
    const handleNicknameChange = (e) => {
        const value = e.target.value;
        setNickname(value);
        setNicknameSaved(false); // Cambiar el estado de guardado si el usuario edita el nickname

        // Validar si el nickname es válido
        if (value.length < 3) {
            setNicknameError("El Nickname debe tener al menos 3 caracteres");
        } else {
            setNicknameError("");
        }
    };

    // Guardar el nickname cuando se hace clic en el botón "Save"
    const handleSaveNickname = async () => {
        if (nickname.length < 3) {
            setNicknameError("El Nickname debe tener al menos 3 caracteres");
            return;
        }

        try {
            console.log(`Enviando petición PUT para actualizar nickname a http://localhost:8080/users/${preferred_username}`);
            const putResponse = await axios.put(`http://localhost:8080/users/${preferred_username}`, {
                nickName: nickname
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Respuesta de PUT:', putResponse.data);
            setNicknameSaved(true);
        } catch (putError) {
            console.error('Error al actualizar el nickname:', putError);
        }
    };

    // Manejar el clic en el botón "Jugar"
    const handlePlayClick = () => {
        if (!nicknameSaved) {
            setErrorMessage("Tienes que crear tu NickName antes de jugar");
        } else {
            // Enviar solo id y name
            navigate('/BlackJackRoyale/SelectTable', {
                state: {
                    id: preferred_username,
                    name: nickname,
                },
            });
        }
    };
    
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
                        <p><strong>Email:</strong> {preferred_username}</p>
                        
                        {/* Campo de entrada para el Nickname */}
                        <p>
                            <strong>Nickname:</strong>
                            <input
                                type="text"
                                value={nickname}
                                onChange={handleNicknameChange}
                                className="nickname-input"
                                disabled={nicknameSaved} // Deshabilitar si el nickname ya está guardado
                            />
                        </p>
                        {nicknameError && <p className="error-message">{nicknameError}</p>}
                        {!nicknameSaved && (
                            <Button 
                                onClick={handleSaveNickname} 
                                variant="primary" 
                                className="save-button"
                                disabled={nickname.length < 3} // Deshabilitar si el nickname no es válido
                            >
                                Save
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mostrar mensaje de error si el nickname no está guardado */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {/* Botón "Jugar" redirige a /BlackJackRoyale/SelectTable */}
                <Button 
                    onClick={handlePlayClick} 
                    variant="warning" 
                    className="play-button" 
                    disabled={!nicknameSaved} // Deshabilitado si no hay nickname guardado
                >
                    Jugar
                </Button>
            </div>
        </>
    );
};

export default IdTokenData;
