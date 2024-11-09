import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Container } from 'react-bootstrap'; // Elimina la importación de Button
import { loginRequest } from '../authConfig';
import './css/Login.css'; // Archivo CSS para estilos personalizados
import logo from './img/logo.PNG'; // Logo pequeño
import fondo from './img/login_fondo.png'; // Imagen de fondo grande

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
            {/* Contenedor de la imagen de fondo (mitad izquierda) */}
            <div className="login-background">
                <img src={fondo} alt="Login Background" className="background-image" />
            </div>
            
            {/* Contenedor del contenido de login (mitad derecha) */}
            <div className="login-content">
                <Container className="login-box">
                    <img src={logo} alt="Casino Logo" className="casino-logo" />
                    
                    {/* Nuevo contenedor para el botón */}
                    <div className="signInButton-container">
                        <button className="signInButton" onClick={handleRedirect}>
                            Sign in
                        </button>
                    </div>

                    <p className="register-text">¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
                </Container>
            </div>
        </div>
    );
};

export default Login;
