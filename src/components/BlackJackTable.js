import React, { useEffect, useState, useRef } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/BlackJackTable.css';
import azul from './img/azul.png';
import amarillo from './img/amarillo.png';
import verde from './img/verde.png';
import roja from './img/roja.png';
import negra from './img/negra.png';
import mesa from './img/mesa.png';
import logo from './img/logo.PNG';
import Bitmap53 from './img/Bitmap57.png'; // Carta por defecto
import luigiCasino from './img/luigicasino.gif';
import signout from './img/previous.png';

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
  const navigate = useNavigate();

  const [saldo, setSaldo] = useState(null);
  const [apuestaActual, setApuestaActual] = useState(null);
  const [ultimoPremio, setUltimoPremio] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [fichasSeleccionadas, setFichasSeleccionadas] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [userCards, setUserCards] = useState([Bitmap53, Bitmap53]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [playersDecision, setPlayersDecision] = useState({});
  const [timer, setTimer] = useState(null);
  const gameStateRef = useRef(null); 
  const playersDecisionRef = useRef({});


  const socketRef = useRef(null);

  const valoresFichas = {
    AZUL: 5,
    AMARILLO: 1,
    VERDE: 25,
    ROJO: 10,
    NEGRO: 100,
  };

  const handleSignOut = () => {
    setSaldo(null);
    setApuestaActual(null);
    setUltimoPremio(null);
    navigate(-1, { replace: true });
  };

  useEffect(() => {
    const newSocket = io('http://localhost:9092', { query: { name, id } });
    socketRef.current = newSocket;
  
    newSocket.emit('joinRoom', roomId.toString(), () => {
      toast.success(`Unido a la sala ${roomId}`);
    });
  
    const handleRoomUpdate = (data) => {
      console.log(`[${name}] Recibido 'roomUpdate' con data:`, data);
      setGameState(data);
      gameStateRef.current = data;
      actualizarEstadoJuego(data);
  
      const playerData = data.players.find((player) => player.nickName === name);
      if (playerData) {
        setSaldo(playerData.amount);
        setApuestaActual(playerData.bet);
        setUserCards(playerData.hand.map((card) => getBitmapImage(card.suit, card.rank)));
        setUltimoPremio(playerData.lastPrize || ultimoPremio);
  
        if (playerData.inTurn) {
          toast.info('¡Es tu turno!');
        }
      } else {
        console.warn(`No se encontró al jugador con nombre "${name}".`);
      }
  
      if (data.winners?.length) {
        toast.success(`Ganadores: ${data.winners.join(', ')}`);
        setIsGameFinished(true);
        iniciarDecisionPrompt(data);
      }
    };
  
    newSocket.on('roomUpdate', handleRoomUpdate);
  
    return () => {
      newSocket.off('roomUpdate', handleRoomUpdate);
      newSocket.disconnect();
    };
  }, [name, id, roomId]);

  const actualizarEstadoJuego = (gameState) => {
    console.log("Actualizando estado del juego:", gameState); // Depuración
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

      updatedPlayerInfo[6] = { hand: gameState.dealerHand || [] };
      setPlayerInfo(updatedPlayerInfo);
    } else {
      console.warn('gameState o gameState.players no disponible o vacío');
    }
  };

  const iniciarDecisionPrompt = (data) => {
    console.log("Iniciando prompt de decisión con data:", data);
  
    const initialDecisions = {};
    data.players.forEach((player) => {
      initialDecisions[player.nickName] = null;
    });
  
    // Inicializar la referencia mutable
    playersDecisionRef.current = initialDecisions;
    
    // Sincronizar el estado de React
    setPlayersDecision({ ...initialDecisions });
  
    // Configurar el temporizador
    const countdown = setTimeout(() => {
      const finalDecisions = { ...playersDecisionRef.current };
      for (let playerNickName in finalDecisions) {
        if (finalDecisions[playerNickName] === null) {
          finalDecisions[playerNickName] = false;
        }
      }
      notificarDecisiones(finalDecisions);
    }, 15000);
  
    setTimer(countdown);
  };

  const handleDecision = (playerNickName, decision) => {
    console.log(`handleDecision llamado para ${playerNickName} con decisión ${decision}`);
  
    // Actualizar la referencia mutable
    playersDecisionRef.current = {
      ...playersDecisionRef.current,
      [playerNickName]: decision,
    };
  
    // Sincronizar el estado de React
    setPlayersDecision({ ...playersDecisionRef.current });
  
    console.log("Decisión actualizada en playersDecisionRef:", playersDecisionRef.current);
  
    // Verificar si todas las decisiones están hechas
    const allDecisionsMade = Object.values(playersDecisionRef.current).every(
      (decision) => decision !== null
    );
  
    if (allDecisionsMade) {
      clearTimeout(timer);
      notificarDecisiones(playersDecisionRef.current); // Enviar decisiones al servidor
    }
  };

  const renderDecisionPrompt = () => {
    if (isGameFinished) {
          console.log("Renderizando prompt de decisión");
    console.log("gameState.players:", gameState.players); // Añade este log
    console.log("playersDecision:", playersDecision); // Añade este log

      return (
        <div className="decision-prompt">
          {gameState.players
            .filter((player) => playersDecision[player.nickName] === null)
            .map((player) => (
              <div key={player.nickName}>
                <p>{player.nickName}, ¿quieres jugar de nuevo?</p>
                <button onClick={() => handleDecision(player.nickName, true)}>Sí</button>
                <button onClick={() => handleDecision(player.nickName, false)}>No</button>
              </div>
            ))}
        </div>
      );
    }
    return null;
  };

  const notificarDecisiones = (decisions) => {
    console.log("Decisiones recopiladas:", decisions);
  
    const playersContinuing = Object.entries(decisions)
      .filter(([_, decision]) => decision)
      .map(([playerNickName]) => playerNickName);
  
    console.log("Jugadores que continúan:", playersContinuing);
  
    if (playersContinuing.length > 0) {
      socketRef.current.emit("restartGame", { roomId, playerNickNames: playersContinuing });
    } else {
      console.warn("No hay jugadores que continúan.");
    }
    setIsGameFinished(false);
  };

  const seleccionarFicha = (color, valor) => {
    console.log(`Seleccionando ficha: ${color} con valor ${valor}`); // Depuración
    if (saldo < valor) {
      toast.error('Saldo insuficiente para esta ficha');
      return;
    }
    setFichasSeleccionadas([...fichasSeleccionadas, color]);
    setSaldo((prevSaldo) => prevSaldo - valor);
    setApuestaActual((prevApuesta) => prevApuesta + valor);
  };

  const apostar = () => {
    if (socketRef.current && roomId) {
      const fichasNormalizadas = fichasSeleccionadas.map((color) => color.toUpperCase());
      console.log("Apostando con fichas:", fichasNormalizadas); // Depuración
      socketRef.current.emit('playerBet', { fichas: fichasNormalizadas, roomId });
      setFichasSeleccionadas([]);
      setUltimoPremio(apuestaActual);
      setApuestaActual(0);
      toast.success('Apuesta realizada con éxito');
    }
  };

  const playerAction = (actionType) => {
    if (socketRef.current && roomId) {
      console.log(`Enviando acción del jugador: ${actionType}`); // Depuración
      socketRef.current.emit('playerAction', { type: actionType, roomId });
      toast.info(`Acción enviada: ${actionType.toUpperCase()}`);
    }
  };

  const renderChips = (chips) =>
    chips.map((chip, index) => {
      const chipImages = {
        NEGRO: negra,
        AZUL: azul,
        VERDE: verde,
        AMARILLO: amarillo,
        ROJO: roja,
      };
      return (
        <img key={index} src={chipImages[chip]} alt={`${chip} chip`} className="player-chip" />
      );
    });
  return (
    <div className="table-container">
      <ToastContainer />
      {renderDecisionPrompt()}
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info">
          <div className="header-info-left">
            <p>Saldo: {saldo !== null ? saldo : 'Cargando...'}</p>
          </div>
          <div className="header-info-center">
            <p>Apuesta: {apuestaActual !== null ? apuestaActual : 'Cargando...'}</p>
          </div>
          <div className="header-info-right">
            <button className="sign-out-button" onClick={handleSignOut}>
              <img src={signout} alt="Sign Out" className="sign-out-icon" />
            </button>
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
            <img src={luigiCasino} alt="Dealer GIF" className="luigi-gif" />
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
                      <p>Nombre: {playerInfo[player]?.name || (player === 6 ? 'Luigi' : 'Esperando...')}</p>
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
