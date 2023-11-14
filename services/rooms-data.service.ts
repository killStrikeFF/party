import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
} from 'rxjs';
import {
  CreateRoom,
  EditRoomBody,
  RoomInfo,
} from '../types/room';
import axios from 'axios';
import { BACKEND_API } from '../utils/backend';
import { Socket } from 'socket.io-client';
import { UserStorage } from '../utils/userStorage.utils';

export class RoomsDataService {

  public readonly rooms$ = new BehaviorSubject<RoomInfo[]>([]);
  public readonly connectedRoomId$ = new BehaviorSubject<string>('');
  public readonly currentRoomInfo$ = combineLatest([
    this.rooms$,
    this.connectedRoomId$,
  ]).pipe(
    map(([rooms, connectedRoomId]) => {
      return rooms.find(room => room.uuid === connectedRoomId);
    }),
    shareReplay(1),
  );
  public readonly connectedRoomName$ = this.currentRoomInfo$.pipe(
    map(currentRoomInfo => currentRoomInfo?.name),
    distinctUntilChanged(),
    shareReplay(1),
  );
  public readonly roomFromExternalLink$ = new BehaviorSubject<string>('');

  constructor(
    private readonly socket: Socket,
    private readonly userStorage: UserStorage,
  ) {
    this.socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });

    combineLatest([
      this.userStorage.currentUserDetails$,
      this.roomFromExternalLink$.pipe(filter(Boolean), distinctUntilChanged()),
    ]).subscribe(([userDetails, roomId]) => {
      this.joinRoom(roomId, userDetails.uuid);
    });
  }

  public updateAllRooms(): void {
    this.socket.emit('updateAllParties');
  }

  public async createRoom(roomDto: CreateRoom): Promise<void> {
    await axios.post(`http://${BACKEND_API}/party`, roomDto);
  };

  public async joinRoom(
    roomUuid: string,
    userUuid: string,
  ): Promise<void> {
    const res = await axios.post(
      `http://${BACKEND_API}/party/join`,
      {
        roomUuid,
        userUuid,
      },
    );
    this.connectedRoomId$.next(res.data.uuid || '');
  };

  public async leaveRoom(): Promise<void> {
    const userId = await this.userStorage.getUserUuid();
    await axios.post(`http://${BACKEND_API}/party/leave`, { uuid: userId });
    this.connectedRoomId$.next('');
    this.roomFromExternalLink$.next('');
  };

  public async editRoom(roomBody: EditRoomBody): Promise<void> {
    await axios.put(`http://${BACKEND_API}/party`);
  }

  public setRoomFromExternalLink(uuid: string): void {
    this.roomFromExternalLink$.next(uuid);
  }
}
