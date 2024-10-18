import React from 'react';
import './css/BlackJackTable.css'; // Archivo CSS con los estilos

const BlackjackTable = () => {
  return (
    <div className="table-container">
      <div className="table">
        {/* Texto del arco */}
        <div className="arc-text">
          <p className="blackjack-text">
            BLACKJACK PAYS 3 TO 2
          </p>
          <p className="insurance-text">
            INSURANCE PAYS 2 TO 1
          </p>
        </div>

        {/* Slots para las cartas */}
        <div className="card-slots">
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;

