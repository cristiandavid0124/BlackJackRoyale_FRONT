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

  const [saldo, setSaldo] = useState(null);  // Estado inicial sin valor predeterminado
  const [apuestaActual, setApuestaActual] = useState(null);
  const [ultimoPremio, setUltimoPremio] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [fichasSeleccionadas, setFichasSeleccionadas] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [userCards, setUserCards] = useState([Bitmap1, Bitmap39]);

  const valoresFichas = {
    AZUL: 1,
    AMARILLO: 5,
    VERDE: 10,
    ROJO: 25,
    NEGRO: 50,
  };

  useEffect(() => {
    const newSocket = io('http://localhost:9092', {
      query: { name, id },
    });
    setSocket(newSocket);

    newSocket.emit('joinRoom', roomId.toString(), () => {
      console.log(`Unido a la sala ${roomId}`);
    });

    newSocket.on('roomUpdate', (data) => {
      setGameState(data);
      actualizarEstadoJuego(data);

      const playerData = data.players.find(player => {
        console.log(`Comparando player.name: "${player.nickName}" con name: "${name}"`);
        return player.nickName === name;
      });

      if (playerData) {
        console.log("Jugador encontrado:", playerData);
        setSaldo(playerData.amount);  // Ahora usa amount como saldo
        setApuestaActual(playerData.bet);
        setUltimoPremio(playerData.lastPrize || ultimoPremio); // Último premio si existe
      } else {
        console.warn(`No se encontró al jugador con nombre "${name}".`);
      }

      if (data.winners.length) {
        alert(`Ganadores: ${data.winners.join(", ")}`);
      }
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [name, id, roomId]);

  const actualizarEstadoJuego = (gameState) => {
    console.log("Estado del juego recibido:", gameState);

    if (gameState && gameState.players) {
      const updatedPlayerInfo = {};
      gameState.players.forEach((player, index) => {
        console.log("Información del jugador:", player);
        updatedPlayerInfo[index + 1] = {
          name: player.nickName || 'Cargando...',
          bet: player.bet || 0,
          hand: player.hand || [],
          chips: player.chips || [],
        };
      });

      updatedPlayerInfo[6] = { hand: gameState.dealerHand || [] }; // Dealer en posición 6
      setPlayerInfo(updatedPlayerInfo);
      console.log("Información de los jugadores actualizada:", updatedPlayerInfo);
    } else {
      console.warn("gameState o gameState.players no disponible o vacío");
    }
  };

  const seleccionarFicha = (color, valor) => {
    if (saldo < valor) {
      alert('Saldo insuficiente para esta ficha');
      return;
    }
    setFichasSeleccionadas([...fichasSeleccionadas, color]);
    setSaldo((prevSaldo) => prevSaldo - valor);
    setApuestaActual((prevApuesta) => prevApuesta + valor);
  };

  const apostar = () => {
    if (socket && roomId) {
      const fichasNormalizadas = fichasSeleccionadas.map((color) => color.toUpperCase());

      console.log("Fichas seleccionadas antes de apostar:", fichasNormalizadas);

      socket.emit('playerBet', { fichas: fichasNormalizadas, roomId }, () => {
        console.log("Apuesta enviada:", fichasNormalizadas);
      });
    }
    setFichasSeleccionadas([]);
    setUltimoPremio(apuestaActual);
    setApuestaActual(0);
  };

  const renderHand = (hand) => hand.map((card, index) => (
    <div key={index} className="player-card">
      {card.value} of {card.suit}
    </div>
  ));

  const renderChips = (chips) => chips.map((chip, index) => {
    const chipImages = { 
      NEGRO: negra, 
      AZUL: azul, 
      VERDE: verde, 
      AMARILLO: amarillo, 
      ROJO: roja 
    };
    return <img key={index} src={chipImages[chip]} alt={`${chip} chip`} className="player-chip" />;
  });

  return (
    <div className="table-container">
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info">
          <div className="header-info-left">
            <p>Saldo: {saldo !== null ? saldo : 'Cargando...'}</p>
          </div>
          <div className="header-info-center">
            <p>Apuesta : {apuestaActual !== null ? apuestaActual : 'Cargando...'}</p>
          </div>
          <div className="header-info-right">
            <p>Último premio: {ultimoPremio !== null ? ultimoPremio : 'Cargando...'}</p>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="left-column">
          <div className="card-slots">
            {userCards.map((card, index) => (
              <img key={index} src={card} alt={`Carta ${index + 1}`} className="card-slot" />
            ))}
          </div>
          <button className="boton-robar" onClick={() => socket.emit('playerAction', { type: 'hit', roomId })}>
            Robar
          </button>
          <div className="fichas">
            <img src={azul} alt="Ficha azul" className="ficha" onClick={() => seleccionarFicha('AZUL', valoresFichas.AZUL)} />
            <img src={amarillo} alt="Ficha amarilla" className="ficha" onClick={() => seleccionarFicha('AMARILLO', valoresFichas.AMARILLO)} />
            <img src={verde} alt="Ficha verde" className="ficha" onClick={() => seleccionarFicha('VERDE', valoresFichas.VERDE)} />
            <img src={roja} alt="Ficha roja" className="ficha" onClick={() => seleccionarFicha('ROJO', valoresFichas.ROJO)} />
            <img src={negra} alt="Ficha negra" className="ficha" onClick={() => seleccionarFicha('NEGRO', valoresFichas.NEGRO)} />
          </div>
          <button className="boton-apostar" onClick={apostar}>Apostar</button>
        </div>

        <div className="right-column">
          <div className="mesa-container">
            <p className="mesa-text">Dealer</p>
            <img src={mesa} alt="mesa" className="mesa" />

            {[1, 2, 3, 4, 5, 6].map((player) => (
              <div key={player} className={`player-slot player-${player}`}>
                {playerInfo[player] && (
                  <>
                    <div className="player-chips">
                      {renderChips(playerInfo[player]?.chips || [])}
                    </div>

                    <div className="player-cards">
                      {renderHand(playerInfo[player]?.hand || [])}
                    </div>
                    
                    <div className="player-info">
                      <p>Nombre: {playerInfo[player]?.name || (player === 6 ? 'Dealer' : 'Esperando...')}</p>
                      {player !== 6 && <p>Apuesta: ${playerInfo[player]?.bet || ''}</p>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;
