import React, { useEffect, useState, useRef } from 'react'; // Asegúrate de incluir useRef aquí

import { useLocation, useNavigate } from 'react-router-dom';
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
import luigiCasino from './img/luigicasino.gif'; // GIF de Luigi animado
import luigiquieto from './img/luigiquieto.png'; // Imagen estática de Luigi
import signout from './img/previous.png';
import { useUser } from './UserContext';
import { useSocket } from './SocketContext';
import ChatBox from './ChatBox';

// Controla si las cartas se muestran en el tablero



const getBitmapImage = (suit, rank) => {
  const suitToBitmapStartIndex = {
    Clubs: 1,
    Diamonds: 14,
    Hearts: 27,
    Spades: 40,
  };

  const rankToIndex = {
    Ace: 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
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
  const { userId, userName } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;

  const [saldo, setSaldo] = useState(null);
  const [apuestaActual, setApuestaActual] = useState(null);
  const [ultimoPremio, setUltimoPremio] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [fichasSeleccionadas, setFichasSeleccionadas] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({});
  const [userCards, setUserCards] = useState([Bitmap53, Bitmap53]);
  const [showDecisionPrompt, setShowDecisionPrompt] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [isDealing, setIsDealing] = useState(false); // Controla si Luigi está repartiendo
  const [luigiState, setLuigiState] = useState('static'); // Puede ser 'static' o 'animated'
  const hasDealtCardsRef = useRef(false); // Referencia para controlar el estado de las cartas
  const showCardsRef = useRef(false); // Maneja si las cartas deben mostrarse
  const luigiAnimationFinishedRef = useRef(false); // Verifica si la animación de Luigi ha terminado
  const [showDealingDialog, setShowDealingDialog] = useState(false); // Nuevo estado para el diálogo
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para controlar la visibilidad del chat
  const [messages, setMessages] = useState([]); // Mueve el estado de mensajes al componente padre
  const enApuestasToastShownRef = useRef(false);




  const { socket, initializeSocket, isSocketReady } = useSocket();

  const valoresFichas = {
    AZUL: 5,
    AMARILLO: 1,
    VERDE: 25,
    ROJO: 10,
    NEGRO: 100,
  };

  const handleSignOut = () => {
    if (socket) {
      console.log('Notificando al servidor sobre la desconexión personalizada.');
      socket.emit('customDisconnect', { reason: 'Sign out by user', roomId }); // Notificar al servidor
      socket.disconnect(); // Desconectar directamente el socket
    }
      setSaldo(null);
    setApuestaActual(null);
    setUltimoPremio(null);
    setFichasSeleccionadas([]);
    setGameState(null);
    setPlayerInfo({});
    setUserCards([Bitmap53, Bitmap53]);
      navigate('/BlackJackRoyale/SelectTable', { replace: true });
  };
  

  useEffect(() => {
    const activeSocket = initializeSocket();

    if (!userId || !userName || !roomId) {
      console.error('Datos insuficientes para unirse a la sala');
      navigate('/BlackJackRoyale', { replace: true });
      return;
    }

    if (activeSocket && isSocketReady) {
      console.log(`Jugador ${userId} se unió a la sala ${roomId}`);
      activeSocket.emit('joinRoom', { userId, roomId });

      const handleRoomUpdate = (data) => {
        console.log(`[DEBUG] Recibido 'roomUpdate':`, data);
        setGameState(data); // Actualiza el estado global del juego
        setGameStatus(data.status); // Sincroniza el estado del juego
        actualizarEstadoJuego(data); // Procesa los datos recibidos (incluyendo lógica de Luigi)

        // Verifica si el estado es EN_APUESTAS y el mensaje no ha sido mostrado antes
        if (data.status === 'EN_APUESTAS' && !enApuestasToastShownRef.current) {
          const allPlayersBet = data.players.every((player) => player.bet > 0);
          if (!allPlayersBet) {
            toast.info('El juego iniciará cuando todos los jugadores en la sala apuesten.');
            enApuestasToastShownRef.current = true; // Marca que ya se mostró el mensaje
          }
        }
        const playerData = data.players.find((player) => player.nickName === userName);
        if (playerData) {
          setSaldo(playerData.amount);
          setApuestaActual(playerData.bet);
          setUserCards(
            playerData.hand.map((card) => getBitmapImage(card.suit, card.rank))
          );
          setUltimoPremio(playerData.lastPrize || ultimoPremio);

          if (playerData.inTurn && luigiAnimationFinishedRef.current) {
            toast.info('¡Es tu turno!');
          }
        }

        if (data.winners?.length) {
          toast.success(`Ganadores: ${data.winners.join(', ')}`);
          setTimeout(() => {
            if (activeSocket && roomId) {
              activeSocket.emit('restartGame', { roomId });
            }
            setShowDecisionPrompt(true);
            hasDealtCardsRef.current = false; // Permite que Luigi reparta cartas nuevamente
            enApuestasToastShownRef.current = false; // Resetea para una nueva ronda

            setIsDealing(false); // Asegúrate de que no haya reparto en curso
            setLuigiState('static'); // Regresa a Luigi a estado estático
          }, 10000);
        }
      };

      activeSocket.on('roomUpdate', handleRoomUpdate);

      return () => {
        activeSocket.off('roomUpdate', handleRoomUpdate);
        activeSocket.emit('leaveRoom', roomId); // Limpieza al desmontar
      };
    }
  }, [userId, userName, roomId, initializeSocket, isSocketReady, navigate]);
  
  const actualizarEstadoJuego = (gameState) => {
    if (!gameState) return;
  
    const { status } = gameState;
  
    const updatedPlayerInfo = {};
    gameState.players.forEach((player, index) => {
      updatedPlayerInfo[index + 1] = {
        name: player.nickName || 'Cargando...',
        bet: player.bet || 0,
        chips: player.chips || [],
        hand: showCardsRef.current ? player.hand || [] : [], 
      };
    });
  
    updatedPlayerInfo[6] = {
      hand: showCardsRef.current ? gameState.dealerHand || [] : [],
    };
  
    setPlayerInfo(updatedPlayerInfo);
  
    if (status === 'EN_JUEGO' && !hasDealtCardsRef.current) {
      console.log('Estado EN_JUEGO detectado. Iniciando animación de reparto...');
      setLuigiState('animated');
      hasDealtCardsRef.current = true;
      showCardsRef.current = false;
      luigiAnimationFinishedRef.current = false;
      setShowDealingDialog(true);
  
      setTimeout(() => {
        console.log('Reparto completado. Actualizando cartas...');
        setLuigiState('static');
        showCardsRef.current = true;
        luigiAnimationFinishedRef.current = true;
        setShowDealingDialog(false);
  
        const updatedCardsInfo = { ...updatedPlayerInfo };
        gameState.players.forEach((player, index) => {
          updatedCardsInfo[index + 1].hand = player.hand || [];
        });
        updatedCardsInfo[6].hand = gameState.dealerHand || [];
        setPlayerInfo(updatedCardsInfo);
      }, 4000);
    }
  };
  
  
  

  const renderDealingDialog = () => {
    if (showDealingDialog) {
      return (
        <div className="dealing-dialog">
          <p>Luigi está repartiendo...</p>
        </div>
      );
    }
    return null;
  };
  const repartirCartas = () => {
    if (isDealing || hasDealtCardsRef.current) {
      console.log("Luigi ya repartió o está repartiendo cartas. No se ejecuta de nuevo.");
      return;
    }

    toast.info('¡Luigi está repartiendo las Cartas!');

    setIsDealing(true);
    hasDealtCardsRef.current = true; // Bloquea futuros repartos inmediatamente

    setLuigiState('animated'); // Luigi animado

    setTimeout(() => {
      toast.info('Repartiendo cartas...');
      setTimeout(() => {
        console.log("Reparto de cartas completado, Luigi vuelve a estar estático.");
        setLuigiState('static');
        setIsDealing(false);
      }, 2000); // Duración de la animación
    }, 6000); // Tiempo inicial de espera antes de repartir
  };

  
  

  

  const seleccionarFicha = (color, valor) => {
    if (gameStatus !== 'EN_APUESTAS') {
      toast.warn('No puedes seleccionar fichas en este momento. Espera a que empiece la ronda de apuestas.');
      return;
    }
    if (saldo < valor) {
      toast.error('Saldo insuficiente para esta ficha');
      return;
    }
    setFichasSeleccionadas([...fichasSeleccionadas, color]);
    setSaldo((prevSaldo) => prevSaldo - valor);
    setApuestaActual((prevApuesta) => prevApuesta + valor);
  };

  const apostar = () => {
    if (gameStatus !== 'EN_APUESTAS') {
      toast.warn('No puedes apostar en este momento. Espera a que empiece la ronda de apuestas.');
      return;
    }
    if (socket && roomId) {
      const fichasNormalizadas = fichasSeleccionadas.map((color) => color.toUpperCase());
      socket.emit('playerBet', { fichas: fichasNormalizadas, roomId });
      setFichasSeleccionadas([]);
      setUltimoPremio(apuestaActual);
      setApuestaActual(0);
      toast.success('Apuesta realizada con éxito');
    }
  };
  

  const playerAction = (actionType) => {
    const currentPlayer = gameState?.players.find((player) => player.nickName === userName);
  
    if (!currentPlayer?.inTurn) {
      toast.warn('No puedes realizar esta acción porque no es tu turno.');
      return;
    }
  
    if (socket && roomId) {
      socket.emit('playerAction', { type: actionType, roomId });
      toast.info(`Acción enviada: ${actionType.toUpperCase()}`);
    }
  };

  const handleDecision = (decision) => {
    setShowDecisionPrompt(false);

    if (decision) {
      if (socket && roomId) {
        socket.emit('joinRoom', { userId, roomId });
      }
    } else {
      handleSignOut();
    }
  };

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const renderDecisionPrompt = () => {
    if (showDecisionPrompt) {
      return (
        <div className="decision-prompt">
          <p>¿Quieres jugar de nuevo?</p>
          <button onClick={() => handleDecision(true)}>Sí</button>
          <button onClick={() => handleDecision(false)}>No</button>
        </div>
      );
    }
    return null;
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
      {renderDealingDialog()} 
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
            <button className="boton-doblar" onClick={() => playerAction('double')}>
              DOUBLE
            </button>
            <button className="boton-robar" onClick={() => playerAction('hit')}>
              HIT
            </button>
            <button className="boton-quedarse" onClick={() => playerAction('stand')}>
              STAND
            </button>
          </div>

          <div className="fichas">
          {Object.entries(valoresFichas)
            .sort(([, valorA], [, valorB]) => valorA - valorB) // Ordena de menor a mayor
            .map(([color, valor]) => (
              <div
                key={color}
                className="ficha-container"
                onClick={() => seleccionarFicha(color, valor)}
              >
                <img
                  src={{
                    AZUL: azul,
                    AMARILLO: amarillo,
                    VERDE: verde,
                    ROJO: roja,
                    NEGRO: negra,
                  }[color]}
                  alt={`Ficha ${color}`}
                  className="ficha"
                />
                <span className="ficha-valor">${valor}</span>
              </div>
            ))}
        </div>
          <button className="boton-apostar" onClick={apostar}>
            Apostar
          </button>
        </div>

        <div className="right-column">
          <div className="mesa-container">
          <img
              src={luigiState === 'static' ? luigiquieto : luigiCasino}
              alt="Luigi"
              className="luigi-gif"
            />
            <img src={mesa} alt="mesa" className="mesa" />

            {[1, 2, 3, 4, 5, 6].map((player) => (
              <div key={player} className={`player-slot player-${player}`}>
                {playerInfo[player] && (
                  <>
                    <div className="player-chips">
                      {renderChips(playerInfo[player]?.chips || [])}
                    </div>

                    <div className="player-cards">
                      {showCardsRef.current &&
                        playerInfo[player]?.hand.map((card, index) => {
                          const cardImage = getBitmapImage(card.suit, card.rank);
                          return (
                            <img
                              key={index}
                              src={cardImage}
                              alt={`${card.rank} of ${card.suit}`}
                              className="player-card"
                            />
                          );
                        })}
                    </div>
                    <div className="player-info1">
                <p>
                    👤{' '}
                   {playerInfo[player]?.name || (player === 6 ? 'Luigi' : 'Esperando...')}
                </p>
                     {player !== 6 && <p>Apuesta: ${playerInfo[player]?.bet || ''}</p>}
                </div>

                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={`chat-container ${isChatOpen ? 'open' : 'closed'}`}>
      {isChatOpen ? (
        <ChatBox
          socket={socket}
          roomId={roomId}
          userName={userName}
          messages={messages} // Pasamos los mensajes actuales
          onNewMessage={handleNewMessage} // Pasamos un callback para manejar nuevos mensajes
          onMinimize={() => setIsChatOpen(false)} // Controla la minimización
        />
      ) : (
        <button className="chat-toggle-button" onClick={() => setIsChatOpen(true)}>
          💬
        </button>
      )}
    </div>
      </div>
    </div>
  );
};

export default BlackjackTable;
