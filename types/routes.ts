import { UserMap } from './user-map';
import { Coordinates } from './coordinates';

export enum ROUTES {
  MAP = 'Map',
  ROOMS = 'Rooms',
  SETTINGS = 'Settings',
  INIT_USER = 'InitUser',
  USERS = 'Users',
  USER = 'User',
  ADD_ROOM = 'AddRoom',
}

export type RootStackParamList = {
  [ROUTES.MAP]: { isCreateRoomMode?: boolean };
  [ROUTES.ROOMS]: { currentUserUuid: string };
  [ROUTES.INIT_USER]: {};
  [ROUTES.SETTINGS]: {};
  [ROUTES.USERS]: {};
  [ROUTES.USER]: { user: UserMap };
  [ROUTES.ADD_ROOM]: { coords: Coordinates, currentUserUuid: string };
};
