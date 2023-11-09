import { RoomInfo } from './room';

export type UserDetailsAuthorizedResponse = UnAuthorizedUserDetails | UserDetails;

export enum UsersStatuses {
  offline = 'offline',
  active = 'active',
}

export interface UnAuthorizedUserDetails {
  auth: false;
}

export interface UserDetails {
  auth: true;
  uuid: string;
  name: string;
  image: string;
  color: string;
  currentRoom?: RoomInfo;
  status: UsersStatuses;
}
