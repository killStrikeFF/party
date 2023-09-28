export enum ROUTES {
  MAP = 'Map',
  ROOMS = 'Rooms',
  SETTINGS = 'Settings',
  INIT_USER = 'InitUser'
}

export type RootStackParamList = {
  [ROUTES.MAP]: { currentClientUuid: string };
  [ROUTES.ROOMS]: { clientUuid: string };
  [ROUTES.INIT_USER]: {};
};



