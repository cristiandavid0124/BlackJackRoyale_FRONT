import { useMsal } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    return activeAccount ? children : <Navigate to="/BlackJackRoyale" />;
};

export default ProtectedRoute;
