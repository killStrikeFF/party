export enum ROUTES {
  MAP = 'Map',
  ROOMS = 'Rooms',
  SETTINGS = 'Settings',
  INIT_USER = 'InitUser'
}

export type RootStackParamList = {
  [ROUTES.MAP]: { currentUserUuid: string };
  [ROUTES.ROOMS]: { currentUserUuid: string };
  [ROUTES.INIT_USER]: {};
  [ROUTES.SETTINGS]: {};
};



