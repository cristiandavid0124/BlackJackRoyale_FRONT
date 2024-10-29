import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import './css/BlackJackTable.css';
import azul from './img/azul.png';
import amarillo from './img/amarillo.png';
import verde from './img/verde.png';
import roja from './img/roja.png';
import negra from './img/negra.png';
import mesa from './img/mesa.png';
import logo from './img/logo.PNG';
import Bitmap1 from './img/Bitmap1.png';
import Bitmap39 from './img/Bitmap39.png';

const BlackjackTable = () => {
  const location = useLocation();
  const { id, name, roomId } = location.state || {};

  const [saldo, setSaldo] = useState(1000);
  const [apuestaActual, setApuestaActual] = useState(0);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [userCards, setUserCards] = useState([Bitmap1, Bitmap39]);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);

  const valoresFichas = {
    azul: 1,
    amarillo: 5,
    verde: 10,
    roja: 25,
    negra: 50,
  };

  const [playerInfo, setPlayerInfo] = useState({});

  useEffect(() => {
    // Inicializa el socket al cargar el componente BlackjackTable
    const newSocket = io('http://localhost:9092', {
      query: {
        name: name,
        id: id, // Enviar el nombre y el id del jugador como parte de la consulta
      },
    });
    setSocket(newSocket);
  
    // Conectar al evento `joinRoom` al entrar a la sala
    newSocket.emit('joinRoom', roomId.toString(), () => {
      console.log(`Unido a la sala ${roomId}`);
    });
  
    // Conectar al evento `loadGameState` para cargar el estado del juego actual al unirse
    newSocket.on('loadGameState', (gameState) => {
      setGameState(gameState);
      actualizarEstadoJuego(gameState);
    });
  
    // Conectar al evento `updateGameState` para actualizar el estado del juego
    newSocket.on(`updateGameState.${roomId}`, (updatedGameState) => {
      setGameState(updatedGameState);
      actualizarEstadoJuego(updatedGameState);
    });
  
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [name, id, roomId]);
  

  const actualizarEstadoJuego = (gameState) => {
    if (gameState && gameState.players) {
      const updatedPlayerInfo = {};
  
      // Asignar los jugadores de gameState a playerInfo por orden de llegada
      gameState.players.forEach((player, index) => {
        updatedPlayerInfo[index + 1] = {
          name: player.name,
          apuesta: player.bet || 0, // Asegúrate de que 'bet' existe, de lo contrario, asigna 0
        };
      });
  
      setPlayerInfo(updatedPlayerInfo);
    }
  };
  

  const agregarApuesta = (valor) => {
    setApuestaActual((prevApuestaActual) => {
      const nuevaApuesta = prevApuestaActual + valor;
      if (nuevaApuesta > 100) {
        alert('La apuesta no puede ser mayor que 100');
        return prevApuestaActual;
      }
      if (saldo >= valor) {
        setSaldo((prevSaldo) => prevSaldo - valor);
        return nuevaApuesta;
      } else {
        alert('Saldo insuficiente para esta apuesta');
        return prevApuestaActual;
      }
    });
  };

  const apostar = () => {
    setUltimoPremio(apuestaActual);
    setApuestaActual(0);
    if (socket && roomId) {
      socket.emit('playerAction', { type: 'bet', amount: apuestaActual, roomId });
    }
  };

  const robarCarta = () => {
    const nuevaCarta = Bitmap39;
    setUserCards((prevCards) => [...prevCards, nuevaCarta]);
    if (socket && roomId) {
      socket.emit('playerAction', { type: 'hit', roomId });
    }
  };

  return (
    <div className="table-container">
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info">
          <div className="header-info-left">
            <p>Saldo: {saldo}</p>
          </div>
          <div className="header-info-center">
            <p>Apuesta total: {apuestaActual}</p>
          </div>
          <div className="header-info-right">
            <p>Último premio: {ultimoPremio}</p>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="left-column">
          <div className="card-slots">
            {userCards.map((card, index) => (
              <img key={index} src={card} alt={`Carta${index + 1}`} className="card-slot" />
            ))}
          </div>
          <button className="boton-robar" onClick={robarCarta}>Robar</button>

          <div className="fichas">
            <img src={azul} alt="Ficha azul" className="ficha" onClick={() => agregarApuesta(valoresFichas.azul)} />
            <p className="ficha-valor">1</p>

            <img src={amarillo} alt="Ficha amarilla" className="ficha" onClick={() => agregarApuesta(valoresFichas.amarillo)} />
            <p className="ficha-valor">5</p>

            <img src={verde} alt="Ficha verde" className="ficha" onClick={() => agregarApuesta(valoresFichas.verde)} />
            <p className="ficha-valor">10</p>

            <img src={roja} alt="Ficha roja" className="ficha" onClick={() => agregarApuesta(valoresFichas.roja)} />
            <p className="ficha-valor">25</p>

            <img src={negra} alt="Ficha negra" className="ficha" onClick={() => agregarApuesta(valoresFichas.negra)} />
            <p className="ficha-valor">50</p>
          </div>
          <button className="boton-apostar" onClick={apostar}>Apostar</button>
        </div>

        <div className="right-column">
          <div className="mesa-container">
            <p className="mesa-text">Dealer</p>
            <img src={mesa} alt="mesa" className="mesa" />

            {/* Espacios para los jugadores */}
            {[1, 2, 3, 4, 5, 6].map((player) => (
              <div key={player} className={`player-slot player-${player}`}>
                {player !== 6 && (
                  <div className="player-chips">
                    {playerInfo[player]?.apuesta > 0 && (
                      <p>Apuesta: ${playerInfo[player].apuesta}</p>
                    )}
                  </div>
                )}

                <div className="player-info">
                  <p>Nombre: {playerInfo[player]?.name || 'Esperando...'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;