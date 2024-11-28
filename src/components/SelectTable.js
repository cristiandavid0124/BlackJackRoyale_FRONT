import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './css/SelectTable.css';
import { useUser } from './UserContext';
import { useSocket } from './SocketContext';
import axios from 'axios';

const SelectTable = () => {
  const navigate = useNavigate();
  const { userId, userName } = useUser();
  const { socket, initializeSocket, isSocketReady } = useSocket();
  const [tables, setTables] = useState([]);
  const [activeButton, setActiveButton] = useState('SelectTable');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      if (!userId) {
        console.error('No se encontró userId, redirigiendo a la página principal.');
        navigate('/BlackJackRoyale', { replace: true });
        return;
      }

      console.log('Iniciando fetchTables con userId:', userId);

      try {
        const activeSocket = initializeSocket(); // Inicializa el socket
        if (activeSocket) {
          console.log('Socket inicializado correctamente.');

          const handleRoomsUpdate = (data) => {
            console.log('Actualización de salas recibida desde el servidor:', data);
            setTables(data);
          };

          // Agregar el listener solo si el socket está listo
          if (isSocketReady) {
            activeSocket.on('roomsUpdate', handleRoomsUpdate);
          }

          // Limpieza de eventos al desmontar
          return () => {
            if (isSocketReady) {
              activeSocket.off('roomsUpdate', handleRoomsUpdate);
            }
          };
        } else {
          console.error('Socket no inicializado. No se puede escuchar eventos.');
        }

        // Obtiene las salas del backend como respaldo
        const response = await axios.get('http://localhost:8080/api/rooms');
        console.log('Salas obtenidas del backend:', response.data);
        setTables(response.data);
      } catch (err) {
        const errorMsg = err.response
          ? `Error en la respuesta del servidor: ${err.response.status}`
          : err.request
          ? 'Error en la solicitud (sin respuesta del servidor).'
          : `Error: ${err.message}`;
        console.error(errorMsg);
        setError('Error al configurar el socket o cargar las salas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
        console.log('fetchTables completado.');
      }
    };

    fetchTables();
  }, [userId, navigate, initializeSocket, isSocketReady]);

  const handleGoToTable = (tableId) => {
    console.log('Intentando unirse a la sala:', tableId);

    if (!userId || !userName) {
      console.error('Datos del usuario no disponibles. Redirigiendo...');
      navigate('/BlackJackRoyale', { replace: true });
      return;
    }

    if (isSocketReady && socket) {
      console.log('Socket conectado. Emitiendo evento joinRoom con datos:', { roomId: tableId, userId });
      // Evitar múltiples uniones al verificar si ya se envió el evento joinRoom
      socket.emit('joinRoom', { roomId: tableId, userId });
      navigate('/BlackJackRoyale/Game', { state: { roomId: tableId } });
    } else {
      console.error('El socket no está listo o es inválido.');
      setError('No se pudo establecer la conexión al servidor. Por favor, inténtalo nuevamente.');
    }
  };

  const handleGoBack = () => {
    console.log('Navegando a la página de información del usuario.');
    navigate('/BlackJackRoyale/UserInfo');
  };

  if (loading) {
    console.log('Cargando salas...');
    return <p>Cargando salas...</p>;
  }

  if (error) {
    console.log('Error detectado:', error);
    return <p className="error-message">{error}</p>;
  }

  console.log('Renderizando componentes con las salas obtenidas:', tables);

  return (
    <>
      <Header activeButton={activeButton} onNavigate={setActiveButton} />
      <div className="main-content">
        <div className="select-table-container">
          <h2>Selecciona una Mesa</h2>
          <div className="table-options">
            {tables.map((table) => (
              <div key={table.roomId} className="table-card">
                <div className="table-card-content">
                  <div className="table-card-left">
                    <div className="table-card-header">Mesa {table.roomId}</div>
                    <p className="table-description">
                      Estado: {table.status === 'EN_ESPERA' ? 'Esperando jugadores' : table.status}
                    </p>
                    <button
                      onClick={() => handleGoToTable(table.roomId)}
                      className={`btn join-button ${
                        table.currentPlayers === table.maxPlayers ? 'disabled' : ''
                      }`}
                      disabled={table.currentPlayers === table.maxPlayers}
                    >
                      {table.currentPlayers === table.maxPlayers ? 'Sala llena' : 'Unirse'}
                    </button>
                  </div>
                  <div className="players-container">
                    <h3>
                      Jugadores ({table.currentPlayers}/{table.maxPlayers})
                    </h3>
                    <ul className="players-list">
                      {table.players.map((player, idx) => (
                        <li key={idx} className="player-item">
                          {player.nickName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {table.currentPlayers === 0 && (
                  <span className="waiting-text">Sin jugadores</span>
                )}
              </div>
            ))}
          </div>
          <div class="btn back-button-container">
          <button onClick={handleGoBack} className="btn back-button">
            Volver
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTable;
