import { useState } from 'react';
import { Form, Button, Card, Navbar, Nav, Container } from 'react-bootstrap';
import BotonAuth from './BotonAuth'; // Importar el componente BotonAuth
import '../styles/Data.css';

export const IdTokenData = () => {
    const [reloadAmount, setReloadAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [balance, setBalance] = useState(0);
    const [recentGames, setRecentGames] = useState(['BlackJack']); // Ejemplo de datos de juegos recientes

    const handleReloadChange = (event) => {
        setReloadAmount(event.target.value);
    };

    const handleReloadSubmit = (event) => {
        event.preventDefault();
        alert(`Recargando ${reloadAmount} a la cuenta de ${nickname}`);
        setReloadAmount('');
    };

    return (
        <>
            {/* Barra de navegación con el logo, un enlace y el componente BotonAuth */}
            <Navbar bg="dark" variant="dark" expand="lg" className="navbarStyle">
                <Container>
                    <Navbar.Brand href="/">BlackJackApp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/Game">Juego</Nav.Link> {/* Enlace a la ruta adicional */}
                        </Nav>
                        <BotonAuth /> {/* Componente para manejar login/logout */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="data-area-div">
                <Card className="user-card">
                    <Card.Body>
                        <Card.Title>Bienvenido, {nickname || 'Usuario'}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Saldo: ${balance}</Card.Subtitle>

                        <Card.Text>
                            <strong>Juegos Recientes:</strong>
                            <ul>
                                {recentGames.map((game, index) => (
                                    <li key={index}>{game}</li>
                                ))}
                            </ul>
                        </Card.Text>

                        <Form onSubmit={handleReloadSubmit} className="reload-form">
                            <Form.Group controlId="nickname">
                                <Form.Label>Nickname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su Nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="balance">
                                <Form.Label>Saldo</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese su Saldo"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="reloadAmount">
                                <Form.Label>Recargar Saldo</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese la cantidad"
                                    value={reloadAmount}
                                    onChange={handleReloadChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Recargar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};
