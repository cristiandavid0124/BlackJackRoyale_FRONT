import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';
import PropTypes from 'prop-types';


const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { userId, userName } = useUser();
  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  // Inicializar el socket
  const initializeSocket = useCallback(() => {
    if (socket) {
      if (socket.connected) {
        console.log('El socket ya está conectado.');
        setIsSocketReady(true);
        return socket;
      } else {
        console.log('Reconectando el socket...');
        socket.connect();
        return socket;
      }
    }

    if (userId && userName) {
      console.log('Inicializando conexión de socket con:', { userId, userName });

      const newSocket = io('https://blackjackroyalebackend-djfwh2cbbqb5ebdq.canadacentral-01.azurewebsites.net', {
        path: '/socket.io',
        query: { id: userId, name: userName },
        transports: ['websocket'], 
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      newSocket.on('connect', () => {
        console.log('Conexión exitosa al servidor de Socket.IO');
        setIsSocketReady(true);
      });

      newSocket.on('disconnect', (reason) => {
        console.warn('Desconectado del servidor de Socket.IO. Razón:', reason);
        setIsSocketReady(false);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Error al conectar al servidor de Socket.IO:', err.message);
        setIsSocketReady(false);
      });

      setSocket(newSocket);
      return newSocket;
    }

    console.error('No se pudo inicializar el socket: faltan datos del usuario.');
    return null;
  }, [socket, userId, userName]);

  // Mantener el socket activo entre componentes
  useEffect(() => {
    const activeSocket = initializeSocket();

    return () => {
      if (activeSocket?.connected) {
        console.log('Manteniendo conexión activa al cambiar de componente.');
      } else {
        console.log('Desconectando socket al desmontar el contexto.');
        activeSocket?.disconnect();
      }
    };    
  }, [initializeSocket]);

  // Asegurarse de que el socket esté siempre disponible
  useEffect(() => {
    if (!socket && userId && userName) {
      console.log('Socket no disponible. Reintentando inicialización.');
      initializeSocket();
    }
  }, [socket, userId, userName, initializeSocket]);

  return (
    <SocketContext.Provider value={useMemo(() => ({ socket, initializeSocket, isSocketReady }), [socket, initializeSocket, isSocketReady])}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired, // Especificamos que 'children' debe ser un nodo React
};