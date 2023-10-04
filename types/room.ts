import { Coordinates } from './coordinates';

export interface Room {
  name: string;
  coords: Coordinates;
}

export interface RoomInfo extends Room {
  uuid: string;
  userCount: number;
  owner: OwnerRoom;
}

export interface OwnerRoom {
  name: string;
  uuid: string;
}

export interface CreateRoom extends Room {
  uuid: string;
}

export interface ConnectToRoom {
  roomUuid: string;
  userUuid: string;
}

export type ClientCoordinatesForRoomDto = Coordinates;
