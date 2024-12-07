import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ChatBox = ({ socket, roomId, userName, messages, onNewMessage, onMinimize }) => {
  const [message, setMessage] = useState(''); // Mensaje actual del input

  useEffect(() => {
    if (socket) {
      console.log('Socket conectado, configurando el listener de mensajes...');

      socket.on('receiveMessage', (newMessage) => {
        console.log('Mensaje recibido en el frontend:', newMessage);
        onNewMessage(newMessage); // Agrega el mensaje al estado global
      });
    } else {
      console.warn('Socket no disponible en ChatBox.');
    }

    return () => {
      if (socket) {
        console.log('Desmontando listener de mensajes...');
        socket.off('receiveMessage');
      }
    };
  }, [socket, onNewMessage]);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      console.log('Enviando mensaje:', { roomId, message, sender: userName });
      socket.emit('sendMessage', { roomId, message, sender: userName });
      setMessage(''); // Limpiar input
    } else {
      console.warn('El mensaje está vacío o el socket no está disponible.');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <span>Chat</span>
        <button className="chat-minimize-button" onClick={onMinimize}>
          ➖
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={msg.id} className="chat-message">
            <strong>{msg.sender}: </strong>
            <span>{msg.message}</span>
          </div>        
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  socket: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    sender: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  onNewMessage: PropTypes.func.isRequired,
  onMinimize: PropTypes.func.isRequired,
};

export default ChatBox;
