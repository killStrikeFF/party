import { RoomsDataService } from '../services/RoomsDataService';
import { ClientStorage } from './client.utils';
import { ChatDataService } from '../services/chat-data.service';
import { UserLocationTracking } from './userLocationTracking';
import { io } from 'socket.io-client';
import { BACKEND_API } from './backend';

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
});

export const roomDataService = new RoomsDataService(socket);
export const clientStorage = new ClientStorage();
export const chatDataService = new ChatDataService(socket);
export const userLocationTracking = new UserLocationTracking(socket, roomDataService);
