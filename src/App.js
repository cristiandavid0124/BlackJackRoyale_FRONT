import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
    const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Register

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div>
            <h1>{isLogin ? 'Iniciar Sesión' : 'Registro de Usuario'}</h1>
            {isLogin ? <Login /> : <Register />}
            <button onClick={toggleForm}>
                {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
            </button>
        </div>
    );
};

export default App;
