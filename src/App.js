import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Button } from 'react-bootstrap';
import { IdTokenData } from './components/DataDisplay';
import { loginRequest } from './authConfig';
import BlackJackTable from "./components/BlackJackTable";



const MainContent = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };
    return (
        <div className="App">
          <Router>
            <Routes>
              {/* Ruta principal o cualquier otra */}
              <Route
                path="/"
                element={
                  <>
                    <AuthenticatedTemplate>
                      {activeAccount ? (
                        <Container>
                          <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                        </Container>
                      ) : null}
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                      <Button className="signInButton" onClick={handleRedirect} variant="primary">
                        Sign up
                      </Button>
                    </UnauthenticatedTemplate>
                  </>
                }
              />
    
              {/* Nueva ruta para BlackRoyale */}
              <Route path="/BlackRoyale" element={<BlackJackTable />} />
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