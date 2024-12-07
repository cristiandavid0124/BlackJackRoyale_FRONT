import React, { useState, useEffect } from "react";
import Header from "./Header";
import Bitmap53 from "./img/Bitmap57.png"; 
import "./css/History.css";
import { useUser } from './UserContext';

const getBitmapImage = (suit, rank) => {
  const suitToBitmapStartIndex = {
    Clubs: 1,
    Diamonds: 14,
    Hearts: 27,
    Spades: 40,
  };

  const rankToIndex = {
    Ace: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
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

const calculateTotalBet = (chips) => {
  const chipValues = {
    AMARILLO: 1.0,
    AZUL: 5.0,
    ROJO: 10.0,
    VERDE: 25.0,
    NEGRO: 100.0,
  };

  return chips.reduce((total, chipColor) => {
    const value = chipValues[chipColor.toUpperCase()] || 0;
    return total + value;
  }, 0);
};

const History = () => {
  const { userId } = useUser(); // Obtener userId del contexto

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserNickName, setCurrentUserNickName] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        console.error("No se encontró userId");
        return;
      }
      try {
        const response = await fetch(
          `https://blackjackroyalebackend-djfwh2cbbqb5ebdq.canadacentral-01.azurewebsites.net/api/users/${encodeURIComponent(userId)}`
        );
        if (!response.ok) {
          throw new Error(`Error al obtener el historial. Código: ${response.status}`);
        }
        const data = await response.json();
        setCurrentUserNickName(data.nickName);
        setHistory(data.gameHistory || []);
      } catch (err) {
        console.error("Error al obtener el historial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const renderCards = (cards) =>
    cards.map((card, i) => (
      <img
        key={card.id}
        src={getBitmapImage(card.suit, card.rank)}
        alt={`${card.rank} de ${card.suit}`}
        className="card-image"
      />
    ));

  const renderWinnerHand = (winnerName, hand) => (
    <div className="winner-hand">
      <p className="text-mano-ganador">
        Mano del Ganador ({winnerName}):
      </p>
      <div className="cards">{renderCards(hand)}</div>
    </div>
  );

// Primero, fuera del return, gestionamos la lógica de qué contenido mostrar
  let content;

  if (loading) {
    content = <div>Cargando historial...</div>;
  } else if (history.length > 0) {
    content = history.map((game) => {
      const currentPlayer = game.players.find(
        (player) => player.nickName === currentUserNickName
      );
      const totalBet = calculateTotalBet(currentPlayer?.chips || []);
      const isWinner = game.winners.includes(currentUserNickName);
      const resultClass = isWinner ? "result-win" : "result-loss";

      const winnerName = game.winners.find(
        (winner) => winner === "Dealer" || winner !== currentUserNickName
      );
      const winnerHand =
        winnerName === "Dealer"
          ? game.dealerHand
          : game.players.find((player) => player.nickName === winnerName)?.hand || [];

      return (
        <div key={game.id} className="history-item">
          {/* Contenedor izquierdo */}
          <div className="result-container">
            <p className={`result-header ${resultClass}`}>
              {isWinner ? "Win" : "Loose"} {isWinner ? `+${totalBet}` : `-${totalBet}`}$
            </p>
            <div className="cards-container">
              <div className="cards">
                <p className="text-tu-mano">Tu mano:</p>
                {renderCards(currentPlayer?.hand || [])}
              </div>
              <div className="cards">
                {winnerHand.length > 0 &&
                  renderWinnerHand(winnerName || "Dealer", winnerHand)}
              </div>
            </div>
          </div>

          {/* Contenedor derecho */}
          <div className="players-container">
            <h3>Players</h3>
            <ul className="players-list">
              {game.players.map((player, idx) => (
                <li key={player.id}>{player.nickName}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    });
  } else {
    content = <div>No hay historial disponible.</div>;
  }

  // Luego, el return principal sigue igual, usando la variable 'content'
  return (
    <div className="history-container">
      <Header activeButton="History" />
      <div className="history-grid">
        {content} {/* Aquí solo se usa la variable que contiene el contenido */}
      </div>
    </div>
  );

  };

export default History;