import { io } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const SelectTable = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtén los datos de id y name desde el componente anterior
    const { id, name } = location.state || {};

    const [selectedTable, setSelectedTable] = useState(null); // Guarda el número de mesa seleccionada
    const [socket, setSocket] = useState(null);

    // Conectar al servidor Socket.IO al cargar el componente
    useEffect(() => {
        const newSocket = io('http://localhost:8080', {
            query: {
                name: name // Enviar el nombre del jugador como parte de la consulta
            }
        });
        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [name]);

    // Función para manejar la selección de mesa
    const handleSelectTable = (tableNumber) => {
        console.log(`Mesa ${tableNumber} seleccionada`);
        setSelectedTable(tableNumber); // Guarda el número de mesa como roomId
    };

    // Función para navegar a la vista de la mesa seleccionada
    const handleGoToTable = () => {
        if (selectedTable && socket) {
            socket.emit('joinRoom', selectedTable.toString(), () => {
                console.log(`Unido a la sala ${selectedTable}`);
                navigate('/BlackJackRoyale/Game', {
                    state: {
                        id,
                        name,
                        roomId: selectedTable, // Envía la mesa seleccionada como roomId
                    },
                });
            });
        }
    };

    // Función para regresar a la pantalla anterior
    const handleGoBack = () => {
        navigate('/BlackJackRoyale/UserInfo');
    };

    return (
        <Container className="select-table-container">
            <h2>Selecciona una Mesa</h2>
            <Button onClick={handleGoBack} variant="secondary" className="back-button">
                Volver
            </Button>
            <div className="table-options">
                {[1, 2, 3, 4, 5].map((table) => (
                    <Button
                        key={table}
                        variant={selectedTable === table ? "success" : "warning"} // Cambia el color si está seleccionada
                        onClick={() => handleSelectTable(table)}
                        className="table-button"
                    >
                        Mesa {table}
                    </Button>
                ))}
            </div>

            {/* Mostrar mensaje con la mesa seleccionada */}
            {selectedTable && (
                <div className="selected-table-message">
                    <p>Mesa {selectedTable} seleccionada. ¿Listo para comenzar?</p>
                    <Button onClick={handleGoToTable} variant="primary" className="go-to-table-button">
                        Ir a la Mesa
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default SelectTable;