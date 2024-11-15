import React from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { IdTokenData } from './components/DataDisplay';
import BlackJackTable from "./components/BlackJackTable";
import SelectTable from './components/SelectTable'; // Importar el nuevo componente
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Rules from './components/Rules'; // Importar el componente Rules

const MainContent = () => {
    const { instance } = useMsal();
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
                    <Navigate to="/BlackJackRoyale/UserInfo" replace /> // Redirigir a UserInfo si ya está logueado
                  ) : (
                    <Login /> // Mostrar login si no está autenticado
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

              {/* Nueva ruta protegida para SelectTable */}
              <Route
                path="/BlackJackRoyale/SelectTable"
                element={
                  <ProtectedRoute>
                    <SelectTable />
                  </ProtectedRoute>
                }
              />

              {/* Ruta protegida para el juego */}
              <Route
                path="/BlackJackRoyale/Game"
                element={
                  <ProtectedRoute>
                    <BlackJackTable />
                  </ProtectedRoute>
                }
              />

<Route
            path="/BlackJackRoyale/SelectTable"
            element={
              <ProtectedRoute>
                <SelectTable />
              </ProtectedRoute>
            }
          />


                {/* Ruta protegida para las reglas */}
                <Route
                    path="/BlackJackRoyale/Rules"
                    element={
                        <ProtectedRoute>
                            <Rules />
                        </ProtectedRoute>
                    }
                />              

            </Routes>
          </Router>
        </div>
    );
};

const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <MainContent />
        </MsalProvider>
    );
};

export default App;
