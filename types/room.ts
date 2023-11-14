import { Coordinates } from './coordinates';

export interface Room {
  name: string;
  initialCoordinates: Coordinates;
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
  userUuid: string;
  isPrivate?: boolean;
}

export type UserCoordinatesForRoomDto = Coordinates;
