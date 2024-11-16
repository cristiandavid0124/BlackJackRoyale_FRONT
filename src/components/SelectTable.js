import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './img/logo1.PNG';
import './css/SelectTable.css';

const SelectTable = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { id, name } = location.state || {};

    const [selectedTable, setSelectedTable] = useState(null);
    const [activeButton, setActiveButton] = useState('Información del Juego');

    const handleSelectTable = (tableNumber) => {
        console.log(`Mesa ${tableNumber} seleccionada`);
        setSelectedTable(tableNumber);
    };

    const handleGoToTable = () => {
        if (selectedTable) {
            navigate('/BlackJackRoyale/Game', {
                state: {
                    id,
                    name,
                    roomId: selectedTable,
                },
            });
        }
    };

    const handleNavigation = (route) => {
        setActiveButton(route);
        if (route === 'Rules') {
          navigate('/BlackJackRoyale/Rules');
        }
      };
      

    const handleGoBack = () => {
        navigate('/BlackJackRoyale/UserInfo');
    };

    return (
        <>
            <header className="Options">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-header" />
                </div>
                <nav className="menu">
                    {['Rules', 'Games', 'History', 'Profile'].map((item) => (
                        <button
                            key={item}
                            className={`btn menu-button ${activeButton === item ? 'active' : ''}`}
                            onClick={() => handleNavigation(item)}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="main-content">
                <div className="select-table-container">
                    <h2>Selecciona una Mesa</h2>
                    
                    <div className="table-options">
                        {[1, 2, 3, 4, 5].map((table) => (
                            <button
                                key={table}
                                onClick={() => handleSelectTable(table)}
                                className={`btn table-button ${selectedTable === table ? 'selected' : ''}`}
                            >
                                Mesa {table}
                            </button>
                        ))}
                    </div>

                    {selectedTable && (
                        <div className="selected-table-message">
                            <p>Mesa {selectedTable} seleccionada. ¿Listo para comenzar?</p>
                            <button onClick={handleGoToTable} className="btn go-to-table-button">
                                Ir a la Mesa
                            </button>
                        </div>
                    )}
                    
                    {/* Botón de volver reubicado aquí debajo de las mesas */}
                    <button onClick={handleGoBack} className="btn back-button">
                        Volver
                    </button>
                </div>
            </div>
        </>
    );
};

export default SelectTable;


