import { Coordinates } from './coordinates';

export interface UserRegion extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}
