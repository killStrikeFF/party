import { Coordinates } from './coordinates';

export interface Room {
  name: string;
  coords: Coordinates;
}

export interface RoomInfo extends Room {
  uuid: string;
  clientsCount: number;
  owner?: string;
}

export interface CreateRoom extends Room {
  socketId: string;
}

export interface ConnectToRoom {
  socketId: string;
  uuid: string;
}
