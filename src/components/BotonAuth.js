import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Button } from 'react-bootstrap';
import { loginRequest } from '../authConfig';
import '../styles/BotonAuth.css';

export const BotonAuth = () => { // Cambia el nombre del componente a BotonAuth
    const { instance } = useMsal();

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };

    return (
        <div className="auth-button-container">
            <AuthenticatedTemplate>
                <Button variant="warning" onClick={handleLogoutRedirect} className="auth-button">
                    Sign out
                </Button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Button onClick={handleLoginRedirect} className="auth-button">
                    Sign in
                </Button>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default BotonAuth; // Asegúrate de exportar el componente con el mismo nombre
