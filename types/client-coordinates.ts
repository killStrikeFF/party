import { Coordinates } from './coordinates';

export interface ClientCoordinates {
  coords: Coordinates;
  socketId: string;
  name: string;
}
