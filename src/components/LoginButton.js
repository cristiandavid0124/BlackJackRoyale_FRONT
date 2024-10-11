// src/components/LoginButton.js
import React from 'react';
import { useMsal } from '@azure/msal-react';

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().catch(e => {
      console.error(e);
    });
  };

  return <button onClick={handleLogin}>Iniciar sesión</button>;
};

export default LoginButton; // Asegúrate de que esto sea correcto

