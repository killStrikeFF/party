export interface RoomUsersPayload {
  users: RoomUserEventData[];
}

export interface RoomUserEventData {
  uuid: string;
  name: string;
  image?: string;
  color?: string;
}

export interface RoomEvent<T> {
  type: RoomEventTypes,
  time: Date;
  payload: T;
}

export enum RoomEventTypes {
  usersUpdate = 'usersUpdate',
}

export type RoomUsersUpdateEvent = RoomEvent<RoomUsersPayload>;
