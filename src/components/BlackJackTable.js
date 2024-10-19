import React from 'react';
import './css/BlackJackTable.css'; // Archivo CSS con los estilos
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
  return (
    <div className="table-container">
      {/* Header con el logo y la información (horizontal) */}
      <header className="table-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo-header" />
        </div>
        <div className="header-info">
          <div className="header-info-left">
            <p>Saldo: 1'000,000</p>
          </div>
          <div className="header-info-center">
            <p>Apuesta total: 500,000</p>
          </div>
          <div className="header-info-right">
            <p>Ultimo premio: 100,000</p>
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

        {/* Fichas */}
        <div className="fichas">
          <img src={azul} alt="Ficha azul" className="ficha" />
          <img src={amarillo} alt="Ficha amarilla" className="ficha" />
          <img src={verde} alt="Ficha verde" className="ficha" />
          <img src={roja} alt="Ficha roja" className="ficha" />
          <img src={negra} alt="Ficha negra" className="ficha" />
        </div>

        {/* Mesa */}
        <div className="Mesa">
          <p className="mesa-text">Dealer</p>
          <img src={mesa} alt="mesa" className="mesa" />
        </div>

        {/* Botones de acción */}
        <div>
          <button className="boton-robar">Robar</button>
          <button className="boton-apostar">Apostar</button>
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;

