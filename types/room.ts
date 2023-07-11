import { Coordinates } from './coordinates';
import { Client } from './client';

export interface Room {
  name: string;
  coords: Coordinates;
}

export interface RoomInfo extends Room {
  uuid: string;
  clientCount: number;
  owner?: Client;
}

export interface CreateRoom extends Room {
  socketId: string;
}

export interface ConnectToRoom {
  socketId: string;
  uuid: string;
}
