import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import authConfig from './authConfig';

const msalInstance = new PublicClientApplication({
  auth: authConfig,
});

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      {/* Tu aplicación aquí */}
    </MsalProvider>
  );
}

export default App;
