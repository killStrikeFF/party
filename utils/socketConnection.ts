import io from 'socket.io-client';
import { BACKEND_API } from './backend';
import { AppState } from 'react-native';

const reconnectAppStateChange = () => {
  if (!socket.active) {
    socket.connect();
  }
};

AppState.addEventListener('change', reconnectAppStateChange);

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

socket.on('disconnect', () => {
  socket.connect();
});
