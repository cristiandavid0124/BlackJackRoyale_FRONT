// SelectTable.js
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/SelectTable.css';

const SelectTable = () => {
    const navigate = useNavigate();

    // Función para manejar la selección de mesa
    const handleSelectTable = (tableNumber) => {
        console.log(`Mesa ${tableNumber} seleccionada`);
        navigate('/BlackJackRoyale/Game');
    };

    return (
        <Container className="select-table-container">
            <h2>Selecciona una Mesa</h2>
            <div className="table-options">
                {[1, 2, 3, 4, 5].map((table) => (
                    <Button
                        key={table}
                        variant="warning"
                        onClick={() => handleSelectTable(table)}
                        className="table-button"
                    >
                        Mesa {table}
                    </Button>
                ))}
            </div>
        </Container>
    );
};

export default SelectTable;
