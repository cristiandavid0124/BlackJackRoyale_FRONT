import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import './css/Login.css';
import logo from './img/logo.PNG';
import fondo from './img/login_fondo.png';

const Login = () => {
    const { instance } = useMsal();

    const handleRedirect = () => {
        const activeAccount = instance.getActiveAccount();

        if (!activeAccount) {
            instance
                .loginRedirect(loginRequest)
                .catch((error) => console.error('Error during loginRedirect:', error));
        } else {
            console.log('User already logged in:', activeAccount);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <img src={fondo} alt="Login Background" className="background-image" />
            </div>

            <div className="login-content">
                <div className="login-box">
                    <img src={logo} alt="Casino Logo" className="casino-logo" />
                    <div className="signInButton-container">
                        <button className="signInButton" onClick={handleRedirect}>
                            Sign in
                        </button>
                    </div>
                    <p className="register-text">
                        ¿No tienes una cuenta?{' '}
                        <a 
                            href="https://signup.live.com/signup?mkt=es-es&lic=1&uaid=6d064110809e409490c4ea17c76acd74" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
