import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import Register from './components/Register'; // Asegúrate de que la ruta sea correcta

function App() {
    const { instance, accounts } = useMsal();
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.error(e);
        });
    };

    const fetchUserData = async () => {
        const accessToken = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        });

        const response = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken.accessToken}`,
            },
        });

        if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            setIsLoggedIn(true);
        } else {
            console.error('Error fetching user data:', response.statusText);
        }
    };

    useEffect(() => {
        if (accounts.length > 0) {
            fetchUserData();
        }
    }, [accounts]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>BlackJack Royale</h1>
                {!isLoggedIn ? (
                    <>
                        <button onClick={handleLogin}>Iniciar Sesión</button>
                        <Register />
                    </>
                ) : (
                    <div>
                        <h2>Bienvenido, {userData?.name || userData?.email}</h2>
                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;


