import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './css/SelectTable.css';
import { useUser } from './UserContext';

const SelectTable = () => {
    const navigate = useNavigate();
    const { userId, userName } = useUser(); // Obtener datos del contexto

    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [activeButton, setActiveButton] = useState('SelectTable');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            if (!userId) {
                console.error('No se encontró userId, redirigiendo a la página principal.');
                navigate('/BlackJackRoyale', { replace: true });
                return;
            }
            try {
                const response = await axios.get('http://localhost:8080/api/rooms');
                const roomIds = response.data.map((room) => room.roomId);
                setTables(roomIds);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setError('Error al cargar las salas. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [userId, navigate]);

    const handleSelectTable = (tableId) => {
        console.log(`Mesa ${tableId} seleccionada`);
        setSelectedTable(tableId);
    };

    const handleGoToTable = () => {
        if (!userId || !userName) {
            console.error('Datos del usuario no disponibles. Redirigiendo...');
            navigate('/BlackJackRoyale', { replace: true });
            return;
        }
        if (selectedTable) {
            navigate('/BlackJackRoyale/Game', {
                state: {
                  roomId: selectedTable,
                },
              });
        } else {
            setError('Por favor selecciona una mesa antes de continuar.');
        }
    };

    const handleGoBack = () => {
        navigate('/BlackJackRoyale/UserInfo');
    };

    if (loading) {
        return <p>Cargando salas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Header activeButton={activeButton} onNavigate={setActiveButton} />

            <div className="main-content">
                <div className="select-table-container">
                    <h2>Selecciona una Mesa</h2>

                    <div className="table-options">
                        {tables.map((tableId) => (
                            <button
                                key={tableId}
                                onClick={() => handleSelectTable(tableId)}
                                className={`btn table-button ${selectedTable === tableId ? 'selected' : ''}`}
                            >
                                Mesa {tableId}
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

                    <button onClick={handleGoBack} className="btn back-button">
                        Volver
                    </button>
                </div>
            </div>
        </>
    );
};

export default SelectTable;
