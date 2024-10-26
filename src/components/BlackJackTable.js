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
  // Estado para el saldo, la apuesta actual y el último premio
  const [saldo, setSaldo] = useState(1000); // Ejemplo de saldo inicial
  const [apuestaActual, setApuestaActual] = useState(0);
  const [ultimoPremio, setUltimoPremio] = useState(0);

  // Valores de cada ficha
  const valoresFichas = {
    azul: 1,
    amarillo: 5,
    verde: 10,
    roja: 25,
    negra: 50,
  };

  // Manejar el clic en una ficha
  const agregarApuesta = (valor) => {
    if (apuestaActual + valor > 100) {
      alert('La apuesta no puede ser mayor que 100');
      return;
    }
    
    if (saldo >= valor) {
      setApuestaActual(apuestaActual + valor);
      setSaldo(saldo - valor);
    } else {
      alert('Saldo insuficiente para esta apuesta');
    }
  };

  // Manejar el clic en el botón de apostar
  const apostar = () => {
    setUltimoPremio(apuestaActual);
    setApuestaActual(0); // Reinicia la apuesta actual
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

      {/* Mesa de Blackjack */}
      <div className="table">
        {/* Texto del arco */}
        <div className="arc-text">
          <p className="blackjack-text"></p>
          <p className="insurance-text"></p>
        </div>

        {/* Slots para las cartas */}
        <div className="card-slots">
          <p className="mano-text">Tu mano</p>
          <img src={Bitmap1} alt="Carta1" className="card-slot" />
          <img src={Bitmap39} alt="Carta2" className="card-slot" />
          <div className="card-slot"></div>
          <div className="card-slot"></div>
        </div>

        {/* Mesa */}
        <div className="Mesa">
          <p className="mesa-text">Dealer</p>
          <img src={mesa} alt="mesa" className="mesa" />
        </div>

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

        {/* Botones de acción */}
        <div>
          <button className="boton-robar">Robar</button>
          <button className="boton-apostar" onClick={apostar}>Apostar</button>
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;


