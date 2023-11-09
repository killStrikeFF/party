import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
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

  constructor(
    private readonly socket: Socket,
    private readonly userStorage: UserStorage,
  ) {
    this.socket.on('allParties', response => {
      this.rooms$.next(response.parties);
    });
  }

  public updateAllRooms(): void {
    this.socket.emit('updateAllParties');
  }

  public async createRoom(roomDto: CreateRoom): Promise<void> {
    await axios.post(`http://${BACKEND_API}/party`, roomDto);
    this.updateAllRooms();
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
    this.updateAllRooms();
    this.connectedRoomId$.next(res.data.uuid || '');
  };

  public async leaveRoom(): Promise<void> {
    const userId = await this.userStorage.getUserUuid();
    await axios.post(`http://${BACKEND_API}/party/leave`, { uuid: userId });
    this.updateAllRooms();
    this.connectedRoomId$.next('');
  };

  public async editRoom(roomBody: EditRoomBody): Promise<void> {
    await axios.put(`http://${BACKEND_API}/party`);
    this.updateAllRooms();
  }
}
