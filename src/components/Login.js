import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/blackjack/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        // Limpiar el formulario o redirigir al usuario
      } else {
        const errorMessage = await response.text();
        alert(`Error al iniciar sesión: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Error en la conexión: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <label>
        Correo Electrónico: 
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </label>
      <br />
      <label>
        Contraseña:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', margin: '8px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </label>
      <br />
      <button type="submit" style={{ padding: '10px 15px', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
        Iniciar sesión
      </button>
    </form>
  );
};

export default Login;