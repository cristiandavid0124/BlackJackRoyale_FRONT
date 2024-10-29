import React, { useState } from 'react';
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
  const [saldo, setSaldo] = useState(1000);
  const [apuestaActual, setApuestaActual] = useState(0);
  const [ultimoPremio, setUltimoPremio] = useState(0);
  const [userCards, setUserCards] = useState([Bitmap1, Bitmap39]);

  const valoresFichas = {
    azul: 1,
    amarillo: 5,
    verde: 10,
    roja: 25,
    negra: 50,
  };
  const [playerInfo, setPlayerInfo] = useState({
    1: { name: "Alice", apuesta: 50 },
    2: { name: "Bob", apuesta: 20 },
    3: { name: "Charlie", apuesta: 30 },
    4: { name: "David", apuesta: 40 },
    5: { name: "Eve", apuesta: 25 },
    6: { name: "Dealer", apuesta: 35 }
  });


    // Estado para las fichas de cada jugador
    const [playerChips, setPlayerChips] = useState({
      1: [roja, negra],
      2: [azul, verde],
      3: [amarillo],
      4: [verde, roja],
      5: [negra, azul],
      6: [amarillo, negra]
    });


    // Estado para las cartas de cada jugador
    const [playerCards, setPlayerCards] = useState({
      1: [Bitmap1, Bitmap39],
      2: [Bitmap1, Bitmap39, Bitmap39],
      3: [Bitmap39,Bitmap1],
      4: [Bitmap1, Bitmap39],
      5: [Bitmap1, Bitmap39],
      6: [Bitmap39]
    });

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
  };

  const robarCarta = () => {
    const nuevaCarta = Bitmap39;
    setUserCards((prevCards) => [...prevCards, nuevaCarta]);
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
                    {playerChips[player]?.map((chip, index) => (
                      <img key={index} src={chip} alt={`Ficha ${index + 1}`} className="player-chip" />
                    ))}
                  </div>
                )}

                <div className="player-cards">
                  {playerCards[player]?.map((card, index) => (
                    <img key={index} src={card} alt={`Player ${player} Card ${index + 1}`} className="player-card" />
                  ))}
                </div>

                <div className="player-info">
                  <p>Nombre: {playerInfo[player].name}</p>
                  {player !== 6 && <p>Apuesta: ${playerInfo[player].apuesta}</p>}
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
