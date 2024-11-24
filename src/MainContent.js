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
      // `userName` se establecerá en `IdTokenData.js` después de obtener el nickname
    }
  }, [accounts, instance, setUserId]);

  const activeAccount = instance.getActiveAccount();

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Redirigir automáticamente de '/' a '/BlackJackRoyale' */}
          <Route path="/" element={<Navigate to="/BlackJackRoyale" replace />} />

          {/* Ruta inicial /BlackJackRoyale */}
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

          {/* Ruta protegida para UserInfo */}
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

          {/* Otras rutas protegidas */}
          <Route
            path="/BlackJackRoyale/SelectTable"
            element={
              <ProtectedRoute>
                <SelectTable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/BlackJackRoyale/Game"
            element={
              <ProtectedRoute>
                <BlackJackTable />
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
