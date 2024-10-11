import React, { useState } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import authConfig from './authConfig';
import LoginButton from './components/LoginButton'; // Asegúrate de que la ruta sea correcta
import LogoutButton from './components/LogoutButton'; // Agregar botón de cierre de sesión si lo necesitas

const msalInstance = new PublicClientApplication({
  auth: authConfig,
});

// Componente para mostrar el estado de inicio de sesión
const AppContent = () => {
  const { accounts } = useMsal(); // Obtener información de la cuenta del usuario

  return (
    <div>
      <h1>Bienvenido a Mi Aplicación</h1>
      {accounts.length > 0 ? (
        <div>
          <h2>Usuario autenticado: {accounts[0].name}</h2>
          <LogoutButton /> {/* Botón para cerrar sesión, opcional */}
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}

export default App;
