import { UserMap } from './user-map';
import { Coordinates } from './coordinates';
import { RoomInfo } from './room';

export enum ROUTES {
  MAP = 'Map',
  ROOMS = 'Rooms',
  SETTINGS = 'Settings',
  USERS = 'Users',
  USER = 'User',
  ROOM_PAGE = 'RoomPage',
}

export type RootStackParamList = {
  [ROUTES.MAP]: { isCreateRoomMode?: boolean, mapCenter?: Coordinates, whisperUserName?: string };
  [ROUTES.ROOMS]: { currentUserUuid: string };
  [ROUTES.SETTINGS]: {};
  [ROUTES.USERS]: {};
  [ROUTES.USER]: { user: UserMap };
  [ROUTES.ROOM_PAGE]: {
    coords?: Coordinates,
    currentUserUuid: string,
    isEditRoom?: boolean;
    roomInfo?: RoomInfo,
    isViewMode?: boolean,
  };
};
