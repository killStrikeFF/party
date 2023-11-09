import { Coordinates } from './coordinates';

export interface Room {
  name: string;
  coords: Coordinates;
}

export interface EditRoomBody {
  uuid: string;
  name?: string;
  currentCoords?: Coordinates;
  icon?: string;
  description?: string;
}

export interface RoomInfo extends Room {
  uuid: string;
  userCount: number;
  owner: OwnerRoom;
  currentCoords?: Coordinates;
  icon?: string;
  description?: string;
}

export interface OwnerRoom {
  name: string;
  uuid: string;
}

export interface CreateRoom extends Room {
  uuid: string;
}

export type UserCoordinatesForRoomDto = Coordinates;
