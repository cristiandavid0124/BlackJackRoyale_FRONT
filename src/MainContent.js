// MainContent.js
import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { IdTokenData } from './components/DataDisplay';
import BlackJackTable from './components/BlackJackTable';
import SelectTable from './components/SelectTable';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Rules from './components/Rules';
import History from './components/History';
import { useUser } from './components/UserContext';
import { SocketProvider } from './components/SocketContext'; // Importar SocketProvider

const MainContent = () => {
  const { instance, accounts } = useMsal();
  const { setUserId } = useUser();

  useEffect(() => {
    const activeAccount = instance.getActiveAccount();

    if (!activeAccount && accounts && accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
      
    }

    const account = instance.getActiveAccount();

    if (account) {
      const idTokenClaims = account.idTokenClaims;
      const userId = idTokenClaims.preferred_username || account.username;

      setUserId(userId);
    }
  }, [accounts, instance, setUserId]);

  const activeAccount = instance.getActiveAccount();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/BlackJackRoyale" replace />} />

          <Route
            path="/BlackJackRoyale"
            element={
              activeAccount ? (
                <Navigate to="/BlackJackRoyale/UserInfo" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/BlackJackRoyale/UserInfo"
            element={
              <ProtectedRoute>
                <Container>
                  <IdTokenData idTokenClaims={activeAccount?.idTokenClaims} />
                </Container>
              </ProtectedRoute>
            }
          />

          {/* Rutas con SocketProvider */}
          <Route
            path="/BlackJackRoyale/SelectTable"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <SelectTable />
                </SocketProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/BlackJackRoyale/Game"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <BlackJackTable />
                </SocketProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/BlackJackRoyale/Rules"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />

          <Route
            path="/BlackJackRoyale/History"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default MainContent;
