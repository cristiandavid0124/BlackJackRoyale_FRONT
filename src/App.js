import { MsalProvider, useMsal } from '@azure/msal-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { IdTokenData } from './components/DataDisplay';
import BlackJackTable from "./components/BlackJackTable";
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Importar el componente ProtectedRoute

const MainContent = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    return (
        <div className="App">
          <Router>
            <Routes>
              {/* Ruta inicial / */}
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

              {/* Ruta protegida para el juego */}
              <Route
                path="/BlackJackRoyale/Game"
                element={
                  <ProtectedRoute>
                    <BlackJackTable />
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
