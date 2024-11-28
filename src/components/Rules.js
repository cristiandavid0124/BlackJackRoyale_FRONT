import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Importamos el Header
import './css/Rules.css'; // CSS actualizado
import { useUser } from './UserContext';

const Rules = () => {
    const navigate = useNavigate();
    const { userId } = useUser(); // Obtener userId del contexto

    const handleGoBack = () => {
        if (!userId) {
            console.error("No se encontró userId, redirigiendo a la página principal.");
            navigate('/BlackJackRoyale', { replace: true });
            return;
        }
        navigate(-1, { replace: true }); // Navega a la página anterior
    };

    return (
        <>
            <Header activeButton="Rules" /> {/* Incluimos el Header */}

            <div className="rules-container">
                <h1>Reglas del Juego de Blackjack</h1>
                <section className="objective">
                    <h2>Objetivo del Juego</h2>
                    <p>
                        El objetivo del Blackjack es sumar un valor en tus cartas lo más cercano posible a 21, sin pasarse. El jugador compite contra el crupier, y quien se acerque más a 21 sin excederlo, gana.
                    </p>
                </section>

                <section className="card-values">
                    <h2>Valores de las Cartas</h2>
                    <ul>
                        <li>Cartas del 2 al 10: Su valor es el mismo número de la carta.</li>
                        <li>Cartas J, Q, K (Figuras): Cada una vale 10 puntos.</li>
                        <li>As: Puede valer 1 o 11, según lo que beneficie más al jugador.</li>
                    </ul>
                </section>

                <section className="basic-rules">
                    <h2>Reglas Básicas</h2>
                    <ul>
                        <li>El jugador y el crupier reciben dos cartas al inicio. Una de las cartas del crupier queda visible para los jugadores.</li>
                        <li>El jugador puede pedir cartas adicionales (Hit) para acercarse a 21 o quedarse con su mano actual (Stand).</li>
                        <li>Si el jugador supera 21, pierde automáticamente (esto se llama "Bust").</li>
                        <li>El crupier debe seguir pidiendo cartas hasta que alcance un mínimo de 17 puntos.</li>
                    </ul>
                </section>

                <section className="game-actions">
                    <h2>Opciones del Jugador</h2>
                    <ul>
                        <li><strong>Hit:</strong> Pedir una carta adicional.</li>
                        <li><strong>Stand:</strong> Mantener la mano actual y terminar el turno.</li>
                        <li><strong>Double Down:</strong> Duplicar la apuesta inicial y recibir solo una carta adicional (solo en ciertas situaciones).</li>
                        <li><strong>Split:</strong> Si las dos primeras cartas son del mismo valor, el jugador puede dividirlas en dos manos separadas (requiere una apuesta adicional).</li>
                        <li><strong>Surrender:</strong> En algunas variantes, el jugador puede retirarse a cambio de perder solo la mitad de su apuesta.</li>
                    </ul>
                </section>

                <section className="winning-conditions">
                    <h2>Condiciones para Ganar</h2>
                    <ul>
                        <li><strong>Blackjack:</strong> Una mano de 21 puntos con solo dos cartas (As y una carta de valor 10) se considera un Blackjack y paga 3:2.</li>
                        <li><strong>Ganar por Puntos:</strong> Si la mano del jugador es más cercana a 21 que la del crupier sin pasarse, el jugador gana y recibe un pago de 1:1.</li>
                        <li><strong>Empate:</strong> Si el jugador y el crupier tienen la misma cantidad de puntos, se considera un empate y la apuesta se devuelve.</li>
                        <li><strong>Bust:</strong> Si el crupier supera 21, el jugador gana automáticamente.</li>
                    </ul>
                </section>

                <div className="button-container">
                    <button onClick={handleGoBack} className="back-button">
                        Volver
                    </button>
                </div>
            </div>
        </>
    );
};

export default Rules;
