import { RoomsDataService } from '../services/rooms-data.service';
import { UserStorage } from './userStorage.utils';
import { ChatDataService } from '../services/chat-data.service';
import { UserLocationTracking } from './userLocationTracking';
import { io } from 'socket.io-client';
import { BACKEND_API } from './backend';
import { UsersDataService } from '../services/users-data.service';

export const socket = io(`ws://${BACKEND_API}`, {
  autoConnect: false,
});

export const userStorage = new UserStorage();
export const roomDataService = new RoomsDataService(socket, userStorage);
export const chatDataService = new ChatDataService(socket);
export const userLocationTracking = new UserLocationTracking(socket, roomDataService);
export const usersData = new UsersDataService(socket, roomDataService);
