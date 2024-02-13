import { RoomsDataService } from '../services/rooms-data.service';
import { UserStorage } from './userStorage.utils';
import { ChatDataService } from '../services/chat-data.service';
import { UserLocationTracking } from './userLocationTracking';
import { UsersDataService } from '../services/users-data.service';
import { socket } from './socketConnection';

export const userStorage = new UserStorage();
export const roomDataService = new RoomsDataService(socket, userStorage);
export const chatDataService = new ChatDataService(socket);
export const userLocationTracking = new UserLocationTracking(socket, roomDataService);
export const usersData = new UsersDataService(socket, roomDataService);
