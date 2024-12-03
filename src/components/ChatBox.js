import React, { useState, useEffect } from "react";

const ChatBox = ({ socket, roomId, userName }) => {
  const [messages, setMessages] = useState([]); // Lista de mensajes
  const [message, setMessage] = useState(""); // Mensaje actual del input

  useEffect(() => {
    if (socket) {
      // Escuchar mensajes retransmitidos por el servidor
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      // Emitir el mensaje al servidor
      socket.emit("sendMessage", { roomId, message, sender: userName });
      setMessage(""); // Limpiar input
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
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

export default ChatBox;
