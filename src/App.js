import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
    const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Register

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    // Estilos en línea para centrar y embellecer el contenedor y el contenido
    const styles = {
        container: {
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#f0f4f8',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
        },
        title: {
            fontSize: '28px',
            color: '#333',
            marginBottom: '20px',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            width: '100%',
            marginTop: '20px',
        },
        buttonHover: {
            backgroundColor: '#45a049',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}</h1>
            {isLogin ? <Login /> : <Register />}
            <button style={styles.button} onClick={toggleForm}>
                {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
            </button>
        </div>
    );
};

export default App;

