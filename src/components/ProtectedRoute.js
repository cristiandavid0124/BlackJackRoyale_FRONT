import { useMsal } from '@azure/msal-react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    return activeAccount ? children : <Navigate to="/BlackJackRoyale" />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
