// ./components/Login.js

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button, Container } from 'react-bootstrap';
import { loginRequest } from '../authConfig';
import './css/Login.css'; // Archivo CSS para estilos personalizados
import logo from './img/logoo.png'; // Asegúrate de que el logo esté en la carpeta assets

const Login = () => {
    const { instance } = useMsal();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Casino Logo" className="casino-logo" />
            <div className="login-box">
                <Container className="login-content">
                    <h1 className="casino-title">Bienvenido a Blackjack</h1>
                    <Button className="signInButton" onClick={handleRedirect} variant="dark">
                        Únete a la Mesa
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default Login;
