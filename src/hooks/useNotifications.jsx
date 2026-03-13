import { useEffect, useState, useRef } from 'react';

export function useNotifications() {
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = 'http://localhost:5173/api';

    let socket;

    const connect = async () => {
      try {
        const { io } = await import('socket.io-client');
        socket = io(SOCKET_URL + '/notifications', {
          transports: ['websocket', 'polling'],
        });

        socket.on('notification', (payload) => {
          const id = Date.now();
          setToasts(prev => [...prev, { id, ...payload }]);
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 5000);
        });

        socketRef.current = socket;
      } catch (err) {
        console.warn('[Notifications] WebSocket connection failed:', err.message);
      }
    };

    connect();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return { toasts, dismiss };
}
