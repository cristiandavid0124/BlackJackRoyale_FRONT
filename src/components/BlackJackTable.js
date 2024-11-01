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
import Bitmap53 from './img/Bitmap57.png'; // Carta por defecto

// Función para obtener la imagen de bitmap correspondiente a la carta
const getBitmapImage = (suit, rank) => {
  const suitToBitmapStartIndex = {
    Clubs: 1,
    Diamonds: 14,
    Hearts: 27,
    Spades: 40,
  };

  const rankToIndex = {
    Ace: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
  };

  const baseIndex = suitToBitmapStartIndex[suit];
  const rankIndex = rankToIndex[rank];
  if (!baseIndex || !rankIndex) {
    console.warn(`Datos inválidos para la carta: suit=${suit}, rank=${rank}`);
    return Bitmap53;
  }

  const bitmapIndex = baseIndex + rankIndex - 1;
  try {
    return require(`./img/Bitmap${bitmapIndex}.png`);
  } catch (error) {
    console.error(`No se encontró Bitmap${bitmapIndex}.png: `, error);
    return Bitmap53;
  }
};


const BlackjackTable = () => {
  const location = useLocation();
  const { id, name, roomId } = location.state || {};
  const [saldo, setSaldo] = useState(null);
  const [apuestaActual, setApuestaActual] = useState(null);
  const [ultimoPremio, setUltimoPremio] = useState(null);
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [fichasSeleccionadas, setFichasSeleccionadas] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [userCards, setUserCards] = useState([Bitmap53, Bitmap53]);
  const [isTurn, setIsTurn] = useState(false);

  const valoresFichas = {
    AZUL: 5,
    AMARILLO: 1,
    VERDE: 25,
    ROJO: 10,
    NEGRO: 100,
  };

  useEffect(() => {
    const newSocket = io('http://localhost:9092', { query: { name, id } });
    setSocket(newSocket);
  
    newSocket.emit('joinRoom', roomId.toString(), () => {
      console.log(`Unido a la sala ${roomId}`);
    });
  
    newSocket.on('roomUpdate', (data) => {
      setGameState(data);
      actualizarEstadoJuego(data);
  
      const playerData = data.players.find((player) => player.nickName === name);
      if (playerData) {
        setSaldo(playerData.amount);
        setApuestaActual(playerData.bet);
        setUserCards(playerData.hand.map((card) => getBitmapImage(card.suit, card.rank)));
        setUltimoPremio(playerData.lastPrize || ultimoPremio);
  
        // Muestra la alerta si el jugador está en turno
        if (playerData.inTurn) {
          window.alert("¡Es tu turno!");
        }
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
    if (gameState && gameState.players) {
      const updatedPlayerInfo = {};
      gameState.players.forEach((player, index) => {
        updatedPlayerInfo[index + 1] = {
          name: player.nickName || 'Cargando...',
          bet: player.bet || 0,
          hand: player.hand || [],
          chips: player.chips || [],
        };
      });

      updatedPlayerInfo[6] = { hand: gameState.dealerHand || [] }; // Dealer en posición 6
      setPlayerInfo(updatedPlayerInfo);
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
      socket.emit('playerBet', { fichas: fichasNormalizadas, roomId });
      setFichasSeleccionadas([]);
      setUltimoPremio(apuestaActual);
      setApuestaActual(0);
    }
  };

  const playerAction = (actionType) => {
    if (socket && roomId) {
      socket.emit('playerAction', { type: actionType, roomId });
    }
  };



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

          <div className="button-row">
          <button className="boton-doblar" onClick={() => playerAction('double')}>DOUBLE</button>
            <button className="boton-robar" onClick={() => playerAction('hit')}>HIT</button>
            <button className="boton-quedarse" onClick={() => playerAction('stand')}>STAND</button>
          </div>
         
       

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
                      {playerInfo[player].hand.map((card, index) => {
                        const cardImage = getBitmapImage(card.suit, card.rank);
                        return <img key={index} src={cardImage} alt={`${card.rank} of ${card.suit}`} className="player-card" />;
                      })}
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
