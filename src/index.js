// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import { MsalProvider } from '@azure/msal-react';
import { UserProvider } from './components/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const root = createRoot(document.getElementById('root'));
root.render(
  <MsalProvider instance={msalInstance}>
    <UserProvider>
      <App />
    </UserProvider>
  </MsalProvider>
);
